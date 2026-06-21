import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Disable static rendering for this dynamic API route
export const dynamic = "force-dynamic";

const CONFIG_PATH = path.join(process.cwd(), "lib", "dashboard-config.json");

// In-memory backup
let memoryConfig = {
  proctoring: {
    maxWarnings: 3,
    blockCopyPaste: true,
    forceFullscreen: true,
    trackTabSwitches: true
  },
  competencies: {
    ProblemFraming: 15,
    DataLiteracy: 15,
    AnalyticalReasoning: 15,
    RootCauseAnalysis: 10,
    Prioritization: 10,
    BusinessThinking: 15,
    DataQualityAwareness: 10,
    Communication: 10
  },
  thresholds: {
    explorer: 40,
    emerging: 60,
    readyFoundation: 80,
    ready: 100
  }
};

export async function GET() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      return NextResponse.json(JSON.parse(data));
    }
  } catch (err) {
    console.error("Failed to read dashboard-config.json, using memory cache:", err);
  }
  return NextResponse.json(memoryConfig);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Quick validation
    if (!body.proctoring || !body.competencies || !body.thresholds) {
      return NextResponse.json({ error: "Missing required configuration fields" }, { status: 400 });
    }

    // Try to write to disk
    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write dashboard-config.json, updating memory cache only:", err);
    }
    
    memoryConfig = body;
    return NextResponse.json({ success: true, config: memoryConfig });
  } catch (error: any) {
    console.error("Error saving dashboard configuration:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
