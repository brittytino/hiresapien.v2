import { NextResponse } from "next/server";
import { connectWithTimeout } from "@/lib/mongodb";
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
        await connectWithTimeout(3000);
        
        // Inline require so we don't break other files if they load first
        const { CandidateProfile } = require("@/models/CandidateProfile");

        // Create the Candidate Profile first
        const profile = await CandidateProfile.create({
          name: body.name || "Guest",
          email: body.email || "guest@example.com",
          phone: body.phone || body.mobile || "0000000000",
          degree: body.degree,
          academic_status: body.academic_status || body.year,
          career_interest: body.career_interest,
          skills: body.skills,
          ws_q1: body.ws_q1,
          ws_q2: body.ws_q2,
          ws_q3: body.ws_q3,
          ds_familiarity: body.ds_familiarity ? Number(body.ds_familiarity) : undefined,
          data_comfort: body.data_comfort ? Number(body.data_comfort) : undefined,
          expectations: body.expectations
        });

        // Create the Simulation Attempt linking to the Profile
        const attempt = await SimulationAttempt.create({
          candidateId: profile._id,
          status: "IN_PROGRESS",
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
