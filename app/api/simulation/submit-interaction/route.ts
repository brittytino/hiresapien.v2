import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { SimulationAttempt } from "@/models/SimulationAttempt";
import simulationData from "@/lib/simulation-data.json";
import { GoogleGenerativeAI } from "@google/generative-ai";

const isLocalAttempt = (id: string) =>
  id.startsWith("local_") || id.startsWith("demo_");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId, missionId, taskId, answer } = body;

    const mission = simulationData.assessment.missions.find((m) => m.id === missionId);
    if (!mission) return NextResponse.json({ error: "Mission not found" }, { status: 404 });

    const task: any = mission.tasks.find((t) => t.id === taskId);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    let scoreEarned = 0;
    const maxScore = task.maxScore || 20;

    // ── Evaluation Engine ──────────────────────────────────────────────────
    if (task.type === "SingleSelect") {
      if (answer === task.correctAnswer) scoreEarned = maxScore;

    } else if (task.type === "MultiSelect") {
      // Partial credit: award proportionally based on correct selections
      if (Array.isArray(answer) && Array.isArray(task.correctAnswer)) {
        const correctSet = new Set(task.correctAnswer as string[]);
        const selectedSet = new Set(answer as string[]);
        let hits = 0;
        selectedSet.forEach((v) => { if (correctSet.has(v)) hits++; });
        // Penalise wrong selections
        const wrongCount = answer.filter((v: string) => !correctSet.has(v)).length;
        const rawRatio = Math.max(0, hits - wrongCount) / correctSet.size;
        scoreEarned = Math.round(maxScore * rawRatio);
      }

    } else if (task.type === "Ranking") {
      // Score by how many items are in the correct position
      if (Array.isArray(answer) && Array.isArray(task.correctAnswer)) {
        let correct = 0;
        (task.correctAnswer as string[]).forEach((item, idx) => {
          if (answer[idx] === item) correct++;
        });
        scoreEarned = Math.round(maxScore * (correct / task.correctAnswer.length));
      }

    } else if (task.type === "Slider") {
      const val = Number(answer);
      if (val >= task.correctRange[0] && val <= task.correctRange[1]) {
        scoreEarned = maxScore;
      } else {
        // Partial credit based on distance from range
        const distFromLow = Math.abs(val - task.correctRange[0]);
        const distFromHigh = Math.abs(val - task.correctRange[1]);
        const dist = Math.min(distFromLow, distFromHigh);
        const penalty = Math.min(dist / maxScore, 1);
        scoreEarned = Math.round(maxScore * Math.max(0, 1 - penalty));
      }

    } else if (task.type === "ShortText") {
      const text = String(answer).toLowerCase().trim();

      if (!text) {
        scoreEarned = 0;
      } else if (process.env.GEMINI_API_KEY) {
        // ── Gemini AI Evaluation ──────────────────────────────────────────
        try {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          const prompt = `You are an expert Data Science recruiter evaluating a candidate simulation response.

Context: ${mission.context}
Question: ${task.question}
Candidate's Answer: "${text}"
Target Keywords: ${task.keywords.join(", ")}

Evaluate if the candidate captured the core insight. Return ONLY valid JSON in this exact format:
{"score": <integer 0 to ${maxScore}>, "reason": "<brief explanation under 20 words>"}`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();

          // Safe JSON parse
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const aiScore = parseInt(parsed.score);
            if (!isNaN(aiScore) && aiScore >= 0 && aiScore <= maxScore) {
              scoreEarned = aiScore;
            } else {
              throw new Error("Invalid score value from Gemini");
            }
          } else {
            throw new Error("No JSON found in Gemini response");
          }
        } catch (aiError) {
          console.error("Gemini AI evaluation failed, using keyword fallback:", aiError);
          // ── Keyword Fallback ────────────────────────────────────────────
          const keywords: string[] = task.keywords || [];
          const hits = keywords.filter((kw: string) => text.includes(kw.toLowerCase())).length;
          if (hits >= 3) scoreEarned = maxScore;
          else if (hits === 2) scoreEarned = Math.round(maxScore * 0.75);
          else if (hits === 1) scoreEarned = Math.round(maxScore * 0.4);
        }
      } else {
        // ── No Gemini Key — pure keyword match ───────────────────────────
        const keywords: string[] = task.keywords || [];
        const hits = keywords.filter((kw: string) => text.includes(kw.toLowerCase())).length;
        if (hits >= 3) scoreEarned = maxScore;
        else if (hits === 2) scoreEarned = Math.round(maxScore * 0.75);
        else if (hits === 1) scoreEarned = Math.round(maxScore * 0.4);
      }
    }

    // ── Persist to DB (if available and not a local/demo attempt) ─────────
    if (process.env.MONGO_URI && !isLocalAttempt(attemptId)) {
      try {
        await connectDB();
        const attempt = await SimulationAttempt.findById(attemptId);
        if (attempt) {
          attempt.interactions.push({
            taskId,
            missionId,
            interactionType: task.type,
            selectedOption: Array.isArray(answer)
              ? answer
              : typeof answer === "string"
              ? answer
              : undefined,
            textValue: task.type === "ShortText" ? String(answer) : undefined,
            sliderValue: task.type === "Slider" ? Number(answer) : undefined,
            scoreEarned,
            maxScore,
            competenciesHit: task.competencies || [],
          });
          await attempt.save();
        }
      } catch (dbErr) {
        console.error("DB save failed (non-fatal):", dbErr);
        // Continue — don't fail the assessment because of DB issue
      }
    }

    // ── Determine next step ───────────────────────────────────────────────
    const allMissions = simulationData.assessment.missions;
    const currentMissionIndex = allMissions.findIndex((m) => m.id === missionId);
    const currentTaskIndex = mission.tasks.findIndex((t) => t.id === taskId);

    const isLastTaskInMission = currentTaskIndex + 1 >= mission.tasks.length;
    const isLastMission = currentMissionIndex + 1 >= allMissions.length;

    let nextMission = null;
    let nextTask = null;

    if (!isLastTaskInMission) {
      // More tasks in current mission
      nextTask = mission.tasks[currentTaskIndex + 1];
      nextMission = mission;
    } else if (!isLastMission) {
      // Move to next mission
      nextMission = allMissions[currentMissionIndex + 1];
      nextTask = nextMission.tasks[0];
    }
    // If both are null → assessment is complete

    const isComplete = isLastTaskInMission && isLastMission;

    return NextResponse.json({
      success: true,
      scoreEarned,
      nextMission: nextMission ? { id: nextMission.id, title: nextMission.title } : null,
      nextTask,
      isComplete,
    });
  } catch (error) {
    console.error("Error submitting interaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
