import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { SimulationAttempt } from "@/models/SimulationAttempt";
import simulationData from "@/lib/simulation-data.json";

// ── In-memory store for demo/local attempts (no DB) ────────────────────────
// In production with MongoDB, this is never used.
const inMemoryScores: Record<string, { answers: any[] }> = {};

const isLocalAttempt = (id: string) =>
  id.startsWith("local_") || id.startsWith("demo_");

// ── Archetype Engine ────────────────────────────────────────────────────────
function generateArchetype(scores: Record<string, number>): string {
  const top = Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0];
  const map: Record<string, string> = {
    DataLiteracy: "Evidence-Driven Analyst",
    AnalyticalReasoning: "Strong Investigator",
    Communication: "Emerging Communicator",
    BusinessThinking: "Business-First Thinker",
    ProblemFraming: "Sharp Problem Framer",
    RootCauseAnalysis: "Root Cause Detective",
    Prioritization: "Strategic Prioritizer",
    DataQualityAwareness: "Data Quality Champion",
  };
  return map[top] || "Analytical Professional";
}

// ── Strengths Engine ────────────────────────────────────────────────────────
function generateStrengths(scores: Record<string, number>): string[] {
  const labels: Record<string, string> = {
    DataLiteracy: "Reading and interpreting data dashboards",
    AnalyticalReasoning: "Forming and validating hypotheses from data",
    Communication: "Communicating findings clearly to stakeholders",
    BusinessThinking: "Connecting data insights to business outcomes",
    ProblemFraming: "Structuring ambiguous problems systematically",
    RootCauseAnalysis: "Identifying root causes from evidence",
    Prioritization: "Prioritizing high-impact investigations",
    DataQualityAwareness: "Recognizing data quality risks",
  };
  return Object.entries(scores)
    .filter(([, v]) => v >= 60)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => labels[key] || key);
}

// ── Improvements Engine ─────────────────────────────────────────────────────
function generateImprovements(scores: Record<string, number>): string[] {
  const labels: Record<string, string> = {
    DataLiteracy: "Practice reading and interpreting multi-metric dashboards",
    AnalyticalReasoning: "Work on structuring hypotheses before jumping to conclusions",
    Communication: "Practice summarizing insights in executive-friendly language",
    BusinessThinking: "Focus on connecting data findings to revenue and cost impact",
    ProblemFraming: "Work on breaking down vague problems into measurable questions",
    RootCauseAnalysis: "Practice the 5-Why framework for investigating issues",
    Prioritization: "Build intuition for weighing urgency vs. impact",
    DataQualityAwareness: "Study common data quality issues and their downstream effects",
  };
  return Object.entries(scores)
    .filter(([, v]) => v < 60)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([key]) => labels[key] || key);
}

// ── Readiness Level ─────────────────────────────────────────────────────────
function getReadinessLevel(score: number): string {
  if (score <= 40) return "Explorer";
  if (score <= 60) return "Emerging Professional";
  if (score <= 80) return "Industry Ready Foundation";
  return "Industry Ready";
}

// ── Demo Score Calculator (no DB) ──────────────────────────────────────────
function computeDemoScores(): { overallScore: number; finalCompScores: Record<string, number> } {
  // Return a sample score for demo mode so the results page always renders
  const finalCompScores = {
    ProblemFraming: 65,
    DataLiteracy: 70,
    AnalyticalReasoning: 60,
    RootCauseAnalysis: 55,
    Prioritization: 68,
    BusinessThinking: 72,
    DataQualityAwareness: 50,
    Communication: 63,
  };
  const compWeights = simulationData.assessment.competencies;
  let overallScore = 0;
  Object.keys(finalCompScores).forEach((comp) => {
    const weight = compWeights[comp as keyof typeof compWeights] || 0;
    overallScore += (finalCompScores[comp as keyof typeof finalCompScores] * weight) / 100;
  });
  return { overallScore: Math.round(overallScore), finalCompScores };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId } = body;

    if (!attemptId) {
      return NextResponse.json({ error: "attemptId is required" }, { status: 400 });
    }

    let overallScore: number;
    let finalCompScores: Record<string, number>;

    if (!process.env.MONGO_URI || isLocalAttempt(attemptId)) {
      // ── Demo / local mode ────────────────────────────────────────────────
      const computed = computeDemoScores();
      overallScore = computed.overallScore;
      finalCompScores = computed.finalCompScores;
    } else {
      // ── Production mode with MongoDB ─────────────────────────────────────
      await connectDB();
      const attempt = await SimulationAttempt.findById(attemptId);
      if (!attempt) {
        return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
      }

      // If already marked as COMPLETED, return early to prevent double-save VersionErrors from Strict Mode
      if (attempt.status === "COMPLETED") {
        return NextResponse.json({
          success: true,
          result: {
            overallScore: attempt.overallScore,
            readinessLevel: attempt.readinessLevel,
            competencyScores: attempt.competencyScores,
            archetype: attempt.archetype,
            strengths: attempt.strengths,
            improvements: attempt.improvements,
            completedAt: attempt.completedAt,
          },
        });
      }

      // Check if all 8 missions are completed
      const totalMissionsCount = simulationData.assessment.missions.length;
      const completedMissionsSet = new Set(attempt.interactions.map((i: any) => i.missionId));
      if (completedMissionsSet.size < totalMissionsCount) {
        return NextResponse.json(
          { error: "You must complete all 8 simulation missions before calculating results." },
          { status: 400 }
        );
      }

      const compWeights = simulationData.assessment.competencies;

      const scores: Record<string, { earned: number; max: number }> = {
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
          if (scores[comp]) {
            scores[comp].earned += interaction.scoreEarned;
            scores[comp].max += interaction.maxScore;
          }
        });
      });

      finalCompScores = {};
      overallScore = 0;

      Object.keys(scores).forEach((comp) => {
        const s = scores[comp];
        const percentage = s.max > 0 ? (s.earned / s.max) * 100 : 0;
        finalCompScores[comp] = Math.round(percentage);
        const weight = compWeights[comp as keyof typeof compWeights] || 0;
        overallScore += (percentage * weight) / 100;
      });

      overallScore = Math.round(overallScore);

      // Persist final scores
      const readinessLevel = getReadinessLevel(overallScore);
      const archetype = generateArchetype(finalCompScores);
      const strengths = generateStrengths(finalCompScores);
      const improvements = generateImprovements(finalCompScores);

      attempt.status = "COMPLETED";
      attempt.completedAt = new Date();
      attempt.overallScore = overallScore;
      attempt.readinessLevel = readinessLevel;
      attempt.competencyScores = finalCompScores as any;
      attempt.archetype = archetype;
      attempt.strengths = strengths;
      attempt.improvements = improvements;

      try {
        await attempt.save();
      } catch (err: any) {
        if (err.name === "VersionError") {
          // Another concurrent request saved the document first.
          // Retrieve the saved values to return.
          const savedAttempt = await SimulationAttempt.findById(attemptId);
          if (savedAttempt) {
            overallScore = savedAttempt.overallScore || overallScore;
            finalCompScores = (savedAttempt.competencyScores as any) || finalCompScores;
          }
        } else {
          throw err;
        }
      }
    }

    const readinessLevel = getReadinessLevel(overallScore);
    const archetype = generateArchetype(finalCompScores);
    const strengths = generateStrengths(finalCompScores);
    const improvements = generateImprovements(finalCompScores);

    return NextResponse.json({
      success: true,
      result: {
        overallScore,
        readinessLevel,
        competencyScores: finalCompScores,
        archetype,
        strengths,
        improvements,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error completing simulation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
