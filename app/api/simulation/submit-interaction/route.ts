import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { SimulationAttempt } from "@/models/SimulationAttempt";
import simulationData from "@/lib/simulation-data.json";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    // Note: Mongoose DB connection is skipped if ENV is not present, to prevent crash during UI testing
    if (process.env.MONGO_URI) {
      await connectDB();
    }
    
    const body = await req.json();
    const { attemptId, missionId, taskId, answer } = body;

    let attempt: any = null;
    if (process.env.MONGO_URI) {
      attempt = await SimulationAttempt.findById(attemptId);
      if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    const mission = simulationData.assessment.missions.find((m) => m.id === missionId);
    if (!mission) return NextResponse.json({ error: "Mission not found" }, { status: 404 });

    const task: any = mission.tasks.find((t) => t.id === taskId);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    let scoreEarned = 0;
    const maxScore = task.maxScore || 20;

    // MVP Evaluation Engine
    if (task.type === "SingleSelect") {
      if (answer === task.correctAnswer) scoreEarned = maxScore;
    } else if (task.type === "MultiSelect" || task.type === "Ranking") {
      // Basic array equality for MVP
      const isCorrect = Array.isArray(answer) && 
        task.correctAnswer && Array.isArray(task.correctAnswer) &&
        answer.length === task.correctAnswer.length && 
        answer.every((val, index) => val === (task.correctAnswer as string[])[index]);
      if (isCorrect) scoreEarned = maxScore;
    } else if (task.type === "Slider") {
      const val = Number(answer);
      if (val >= task.correctRange[0] && val <= task.correctRange[1]) {
        scoreEarned = maxScore;
      }
    } else if (task.type === "ShortText") {
      const text = String(answer).toLowerCase();
      
      // Attempt to use Gemini AI
      if (process.env.GEMINI_API_KEY) {
        try {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          
          const prompt = `You are an expert Data Science recruiter evaluating a candidate's response in a simulation.
Context: ${mission.context}
Question: ${task.question}
Candidate's Answer: "${text}"
Target Keywords: ${task.keywords.join(", ")}

Analyze if the candidate successfully captured the core essence of the target keywords and the question. 
Output ONLY a single integer score between 0 and ${maxScore}. No other text.`;

          const result = await model.generateContent(prompt);
          const aiScore = parseInt(result.response.text().trim());
          
          if (!isNaN(aiScore)) {
            scoreEarned = aiScore;
          } else {
            throw new Error("Gemini returned non-integer");
          }
        } catch (aiError) {
          console.error("Gemini AI failed, falling back to keyword match:", aiError);
          // Fallback keyword match
          const keywordsHit = task.keywords.filter((kw: string) => text.includes(kw.toLowerCase()));
          if (keywordsHit.length >= 2) scoreEarned = maxScore;
          else if (keywordsHit.length === 1) scoreEarned = maxScore / 2;
        }
      } else {
        // Fallback keyword match if no API key
        const keywordsHit = task.keywords.filter((kw: string) => text.includes(kw.toLowerCase()));
        if (keywordsHit.length >= 2) scoreEarned = maxScore;
        else if (keywordsHit.length === 1) scoreEarned = maxScore / 2;
      }
    }

    if (attempt) {
      attempt.interactions.push({
        taskId,
        missionId,
        interactionType: task.type,
        selectedOption: Array.isArray(answer) ? answer : typeof answer === 'string' ? answer : undefined,
        textValue: task.type === "ShortText" ? answer : undefined,
        sliderValue: task.type === "Slider" ? Number(answer) : undefined,
        scoreEarned,
        maxScore,
        competenciesHit: task.competencies,
      });
      await attempt.save();
    }

    // Determine next step
    const currentTaskIndex = mission.tasks.findIndex((t) => t.id === taskId);
    let nextTask = null;
    let nextMission = null;

    if (currentTaskIndex + 1 < mission.tasks.length) {
      nextTask = mission.tasks[currentTaskIndex + 1];
      nextMission = mission;
    } else {
      const currentMissionIndex = simulationData.assessment.missions.findIndex((m) => m.id === missionId);
      if (currentMissionIndex + 1 < simulationData.assessment.missions.length) {
        nextMission = simulationData.assessment.missions[currentMissionIndex + 1];
        nextTask = nextMission.tasks[0];
      }
    }

    return NextResponse.json({
      success: true,
      scoreEarned,
      nextMission: nextMission ? { ...nextMission, tasks: undefined } : null,
      nextTask,
      isComplete: !nextMission && !nextTask
    });

  } catch (error) {
    console.error("Error submitting interaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
