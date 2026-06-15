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
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required lead fields." }, { status: 400 });
    }

    const attempt = await SimulationAttempt.create({
      candidate: { name, email, phone },
      status: "IN_PROGRESS",
      interactions: [],
    });

    // Return the first mission and attempt ID
    const firstMission = simulationData.assessment.missions[0];

    return NextResponse.json({
      attemptId: attempt._id,
      mission: firstMission,
      totalMissions: simulationData.assessment.missions.length,
    });
  } catch (error) {
    console.error("Error starting simulation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
