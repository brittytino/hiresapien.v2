import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { SimulationAttempt } from "@/models/SimulationAttempt";
import simulationData from "@/lib/simulation-data.json";

export async function POST(req: Request) {
  try {
    if (process.env.MONGO_URI) {
      await connectDB();
    }
    const body = await req.json();
    const { attemptId } = body;

    const attempt = await SimulationAttempt.findById(attemptId);
    if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });

    // Calculate Scores based on weights
    const compWeights = simulationData.assessment.competencies;
    
    // Structure to hold totals
    const scores = {
      ProblemFraming: { earned: 0, max: 0 },
      DataLiteracy: { earned: 0, max: 0 },
      AnalyticalReasoning: { earned: 0, max: 0 },
      RootCauseAnalysis: { earned: 0, max: 0 },
      Prioritization: { earned: 0, max: 0 },
      BusinessThinking: { earned: 0, max: 0 },
      DataQualityAwareness: { earned: 0, max: 0 },
      Communication: { earned: 0, max: 0 },
    };

    attempt.interactions.forEach((interaction: any) => {
      interaction.competenciesHit.forEach((comp: string) => {
        if (scores[comp as keyof typeof scores]) {
          scores[comp as keyof typeof scores].earned += interaction.scoreEarned;
          scores[comp as keyof typeof scores].max += interaction.maxScore;
        }
      });
    });

    // Calculate final weighted score
    let overallScore = 0;
    const finalCompScores: any = {};

    Object.keys(scores).forEach((comp) => {
      const s = scores[comp as keyof typeof scores];
      const percentage = s.max > 0 ? (s.earned / s.max) * 100 : 0;
      finalCompScores[comp] = Math.round(percentage);
      
      const weight = compWeights[comp as keyof typeof compWeights] || 0;
      overallScore += (percentage * (weight / 100));
    });

    overallScore = Math.round(overallScore);

    // Determine Readiness Level
    let readinessLevel = "Explorer";
    if (overallScore > 40 && overallScore <= 60) readinessLevel = "Emerging Professional";
    else if (overallScore > 60 && overallScore <= 80) readinessLevel = "Industry Ready Foundation";
    else if (overallScore > 80) readinessLevel = "Industry Ready";

    attempt.status = "COMPLETED";
    attempt.completedAt = new Date();
    attempt.overallScore = overallScore;
    attempt.readinessLevel = readinessLevel;
    attempt.competencyScores = finalCompScores;

    await attempt.save();

    return NextResponse.json({
      success: true,
      overallScore,
      readinessLevel,
      competencyScores: finalCompScores
    });

  } catch (error) {
    console.error("Error completing simulation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
