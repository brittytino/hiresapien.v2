import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { SimulationAttempt } from "@/models/SimulationAttempt";
import simulationData from "@/lib/simulation-data.json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, degree, year, skills, confidence } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and phone are required." },
        { status: 400 }
      );
    }

    let attemptId: string;

    if (process.env.MONGO_URI) {
      try {
        await connectDB();
        const attempt = await SimulationAttempt.create({
          candidate: { name, email, phone, degree, year, skills, confidence },
          status: "IN_PROGRESS",
          interactions: [],
        });
        attemptId = attempt._id.toString();
      } catch (dbErr) {
        console.error("DB error — falling back to in-memory mode:", dbErr);
        // Graceful fallback: generate a session-based ID without DB
        attemptId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      }
    } else {
      // No MONGO_URI set — run in demo mode
      attemptId = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    const firstMission = simulationData.assessment.missions[0];

    return NextResponse.json({
      attemptId,
      mission: firstMission,
      totalMissions: simulationData.assessment.missions.length,
    });
  } catch (error) {
    console.error("Error starting simulation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
