import { NextResponse } from "next/server";
import { connectWithTimeout } from "@/lib/mongodb";
import { CandidateProfile } from "@/models/CandidateProfile";
import { SimulationAttempt } from "@/models/SimulationAttempt";
import { SimulationResult } from "@/models/SimulationResult";
import { SimulationResponse } from "@/models/SimulationResponse";

// Disable static rendering for this dynamic API route
export const dynamic = "force-dynamic";

export async function GET() {
  let isDatabaseConnected = false;
  try {
    // Attempt DB connection with timeout
    await connectWithTimeout(3000);
    isDatabaseConnected = true;
  } catch (dbErr) {
    console.error("Dashboard API database connection failed, falling back to mock data:", dbErr);
  }

  try {
    if (isDatabaseConnected) {
      // Fetch all candidate profiles
      const profiles = await CandidateProfile.find().lean();
      
      // If we have actual candidates in the DB, let's aggregate and serve them
      if (profiles && profiles.length > 0) {
        const aggregatedCandidates = [];

        for (const profile of profiles) {
          // Find attempts for this candidate
          const attempts = await SimulationAttempt.find({ candidateId: profile._id as any })
            .sort({ startedAt: -1 })
            .lean();

          if (attempts.length === 0) {
            // Signed up candidate who hasn't started the simulation
            aggregatedCandidates.push({
              id: (profile._id as any).toString(),
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              degree: profile.degree || "Not Specified",
              academicStatus: profile.academic_status || "Not Specified",
              careerInterest: profile.career_interest || "Not Specified",
              skills: profile.skills || [],
              dataComfort: profile.data_comfort || 5,
              dsFamiliarity: profile.ds_familiarity || 5,
              startedAt: null,
              completedAt: null,
              status: "NOT_STARTED" as const,
              warningCount: 0,
              warningEvents: [],
              result: null,
              responses: [],
              createdAt: profile.createdAt,
            });
            continue;
          }

          // If there are attempts, let's take the latest attempt
          const latestAttempt = attempts[0];

          // Fetch the simulation result for this attempt if completed
          const result = await SimulationResult.findOne({ attemptId: latestAttempt._id as any }).lean();

          // Fetch responses for this attempt
          const responses = await SimulationResponse.find({ attemptId: latestAttempt._id as any })
            .sort({ createdAt: 1 })
            .lean();

          aggregatedCandidates.push({
            id: (profile._id as any).toString(),
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            degree: profile.degree || "Not Specified",
            academicStatus: profile.academic_status || "Not Specified",
            careerInterest: profile.career_interest || "Not Specified",
            skills: profile.skills || [],
            dataComfort: profile.data_comfort || 5,
            dsFamiliarity: profile.ds_familiarity || 5,
            startedAt: latestAttempt.startedAt,
            completedAt: latestAttempt.completedAt || null,
            status: latestAttempt.status,
            warningCount: latestAttempt.warningCount || 0,
            warningEvents: latestAttempt.warningEvents || [],
            result: result
              ? {
                  overallScore: result.overallScore,
                  competencyScores: result.competencyScores,
                  readinessLevel: result.readinessLevel,
                  archetype: result.archetype || "Analytical Professional",
                  strengths: result.strengths || [],
                  improvements: result.improvements || [],
                }
              : null,
            responses: responses.map((r: any) => ({
              missionId: r.missionId,
              taskId: r.taskId,
              scoreEarned: r.scoreEarned,
              maxScore: r.maxScore,
              selectedOption: r.selectedOption,
              textValue: r.textValue,
              sliderValue: r.sliderValue,
              competenciesHit: r.competenciesHit || [],
            })),
            createdAt: profile.createdAt,
          });
        }

        // If there's enough data (more than 5), return it. Otherwise, augment with mock data for a richer dashboard.
        if (aggregatedCandidates.length >= 5) {
          return NextResponse.json({
            success: true,
            candidates: aggregatedCandidates,
            isMockData: false,
          });
        }
      }
    }
  } catch (err: any) {
    console.error("Error aggregating dashboard data from database:", err);
  }

  // Fallback / Augmentation: High-fidelity synthetic dataset
  const mockCandidates = generateMockCandidates();
  return NextResponse.json({
    success: true,
    candidates: mockCandidates,
    isMockData: true,
  });
}

// ── Mock Data Generator ─────────────────────────────────────────────────────
function generateMockCandidates() {
  const names = [
    { name: "Sarah Johnson", email: "sarah.j@edu.university.org" },
    { name: "Michael Chen", email: "mchen99@mit.edu" },
    { name: "Priya Patel", email: "priya.patel@stanford.edu" },
    { name: "David Kim", email: "dkim@berkeley.edu" },
    { name: "Elena Rostova", email: "erostova@oxford.ac.uk" },
    { name: "Alex Mercer", email: "amercer@gatech.edu" },
    { name: "Jordan Vance", email: "jvance@wharton.upenn.edu" },
    { name: "Amina Diop", email: "adiop@columbia.edu" },
    { name: "Li Wei", email: "li.wei@tsinghua.edu.cn" },
    { name: "Chloe Dupont", email: "cdupont@hec.fr" },
    { name: "Marcus Vance", email: "marcus.v@nyu.edu" },
    { name: "Maya Lin", email: "mayalin@utexas.edu" },
    { name: "Devon Lane", email: "devon.lane@uwaterloo.ca" },
    { name: "Siddharth Nair", email: "snair@iitd.ac.in" },
    { name: "Mateo Silva", email: "mateo.silva@usp.br" },
    { name: "Emma Watson", email: "ewatson@brown.edu" },
    { name: "Zarah Khan", email: "zarahk@lse.ac.uk" },
    { name: "Keanu Reeves", email: "keanu.r@utoronto.ca" },
    { name: "Taylor Swift", email: "tswift@nyu.edu" },
    { name: "Dua Lipa", email: "dualipa@cambridge.ac.uk" },
    { name: "Billie Eilish", email: "beilish@usc.edu" },
    { name: "Justin Bieber", email: "jbieber@mcgill.ca" },
    { name: "Robert Downey", email: "rdj@caltech.edu" },
    { name: "Zendaya Coleman", email: "zendaya@oakland.edu" },
    { name: "Tom Holland", email: "tholland@imperial.ac.uk" },
  ];

  const degrees = [
    "B.S. Computer Science",
    "M.S. Data Science",
    "B.A. Business Analytics",
    "Ph.D. Statistics",
    "M.B.A. Business Intelligence",
    "B.S. Economics & Data",
    "M.S. Quantitative Finance",
  ];

  const statusOptions = ["Senior", "Graduate Student", "Alumni", "Junior"];
  
  const careerInterests = [
    "Data Scientist",
    "Machine Learning Engineer",
    "Data Analyst",
    "Quantitative Researcher",
    "Product Analyst",
    "Business Intelligence Engineer",
  ];

  const skillOptions = [
    "Python", "SQL", "Tableau", "Machine Learning", "Statistics", "R",
    "Excel", "Data Visualization", "PowerBI", "Deep Learning", "A/B Testing",
    "Git", "Scikit-Learn", "Pandas", "PyTorch"
  ];

  const archetypes = [
    { name: "Evidence-Driven Analyst", comp: "DataLiteracy" },
    { name: "Strong Investigator", comp: "AnalyticalReasoning" },
    { name: "Business-First Thinker", comp: "BusinessThinking" },
    { name: "Sharp Problem Framer", comp: "ProblemFraming" },
    { name: "Root Cause Detective", comp: "RootCauseAnalysis" },
    { name: "Strategic Prioritizer", comp: "Prioritization" },
    { name: "Data Quality Champion", comp: "DataQualityAwareness" },
    { name: "Emerging Communicator", comp: "Communication" },
  ];

  const mockCandidates = [];

  for (let i = 0; i < names.length; i++) {
    const candidate = names[i];
    const degree = degrees[i % degrees.length];
    const academicStatus = statusOptions[i % statusOptions.length];
    const careerInterest = careerInterests[i % careerInterests.length];
    
    // Choose 3-6 random skills
    const skillsCount = 3 + (i % 4);
    const skills = [...skillOptions]
      .sort(() => 0.5 - Math.random())
      .slice(0, skillsCount);

    const dsFamiliarity = 1 + (i % 9); // 1-10
    const dataComfort = 2 + (i % 8); // 2-10

    // Date over past 30 days
    const startedAtDate = new Date();
    startedAtDate.setDate(startedAtDate.getDate() - (i % 30));
    startedAtDate.setHours(10 + (i % 12), i * 7 % 60, 0, 0);

    // Status: 80% COMPLETED, 12% IN_PROGRESS, 8% TERMINATED
    let status: "COMPLETED" | "IN_PROGRESS" | "TERMINATED" = "COMPLETED";
    if (i % 10 === 8) status = "IN_PROGRESS";
    else if (i % 10 === 9) status = "TERMINATED";

    const completedAtDate = status === "COMPLETED" 
      ? new Date(startedAtDate.getTime() + (12 + (i % 10)) * 60000) // 12-21 minutes later
      : null;

    // Warnings
    let warningCount = 0;
    const warningEvents = [];
    if (i % 3 === 0) {
      warningCount = 1;
      warningEvents.push({
        timestamp: new Date(startedAtDate.getTime() + 4 * 60000),
        reason: "Tab switch detected: candidate left simulation window.",
      });
    }
    if (i % 7 === 0) {
      warningCount = 2;
      warningEvents.push({
        timestamp: new Date(startedAtDate.getTime() + 8 * 60000),
        reason: "Window resize detected.",
      });
    }
    if (status === "TERMINATED") {
      warningCount = 3;
      warningEvents.push({
        timestamp: new Date(startedAtDate.getTime() + 10 * 60000),
        reason: "Tab switch detected: limit exceeded. Terminated.",
      });
    }

    // Result & competency scores (completed only)
    let result = null;
    if (status === "COMPLETED" || status === "TERMINATED") {
      const overallScore = 40 + (i * 2.3 % 58) + (status === "TERMINATED" ? -15 : 0);
      const scoreInt = Math.min(100, Math.max(0, Math.round(overallScore)));

      // Generate competency scores centered around overallScore
      const competencyScores: Record<string, number> = {};
      const comps = [
        "ProblemFraming", "DataLiteracy", "AnalyticalReasoning", "RootCauseAnalysis",
        "Prioritization", "BusinessThinking", "DataQualityAwareness", "Communication"
      ];
      
      comps.forEach((comp, idx) => {
        const offset = -15 + ((i + idx * 7) % 31); // -15 to +15
        competencyScores[comp] = Math.min(100, Math.max(10, Math.round(scoreInt + offset)));
      });

      // Readiness Level
      let readinessLevel = "Explorer";
      if (scoreInt > 80) readinessLevel = "Industry Ready";
      else if (scoreInt > 60) readinessLevel = "Industry Ready Foundation";
      else if (scoreInt > 40) readinessLevel = "Emerging Professional";

      // Archetype
      const archetypeObj = archetypes[i % archetypes.length];
      const archetype = archetypeObj.name;

      // Strengths & Improvements
      const strengthsList = [
        "Structuring ambiguous problems systematically",
        "Reading and interpreting data dashboards",
        "Forming and validating hypotheses from data",
        "Identifying root causes from evidence",
        "Prioritizing high-impact investigations",
        "Connecting data insights to business outcomes",
        "Recognizing data quality risks",
        "Communicating findings clearly to stakeholders"
      ];

      const improvementsList = [
        "Work on breaking down vague problems into measurable questions",
        "Practice reading and interpreting multi-metric dashboards",
        "Work on structuring hypotheses before jumping to conclusions",
        "Practice the 5-Why framework for investigating issues",
        "Build intuition for weighing urgency vs. impact",
        "Focus on connecting data findings to revenue and cost impact",
        "Study common data quality issues and their downstream effects",
        "Practice summarizing insights in executive-friendly language"
      ];

      const sortedComps = Object.entries(competencyScores).sort((a, b) => b[1] - a[1]);
      const strengths = [
        strengthsList[comps.indexOf(sortedComps[0][0])],
        strengthsList[comps.indexOf(sortedComps[1][0])],
      ];
      const improvements = [
        improvementsList[comps.indexOf(sortedComps[sortedComps.length - 1][0])],
        improvementsList[comps.indexOf(sortedComps[sortedComps.length - 2][0])],
      ];

      result = {
        overallScore: scoreInt,
        competencyScores,
        readinessLevel,
        archetype,
        strengths,
        improvements,
      };
    }

    // Generate detailed mission responses (completed candidates have 8, terminated have 4, in_progress have 2)
    const responses = [];
    const responseCount = status === "COMPLETED" ? 8 : (status === "TERMINATED" ? 4 : 2);
    
    const missionNames = [
      "M1: Onboarding & Data Load Check",
      "M2: SQL Pipeline Investigation",
      "M3: Dashboard Anomaly Discovery",
      "M4: Root Cause Deep-Dive",
      "M5: Business Impact Valuation",
      "M6: A/B Test Hypotheses",
      "M7: Presentation Preparation",
      "M8: Stakeholder Briefing"
    ];

    const promptDetails = [
      "Identify the incorrect join type causing missing user transactions.",
      "Diagnose slow query performance in the customer dashboard database.",
      "Isolate a drop in core conversions for iOS v15 users.",
      "Investigate third-party payment gateway latency spike.",
      "Calculate financial loss due to checkout downtime in Q2.",
      "Formulate statistical null and alternative hypotheses for button test.",
      "Filter out anomalous bot transactions from core metrics.",
      "Explain the trade-offs of the chosen solution to the Chief Product Officer."
    ];

    const compMapping = [
      ["ProblemFraming", "DataLiteracy"],
      ["AnalyticalReasoning", "DataQualityAwareness"],
      ["DataLiteracy", "AnalyticalReasoning"],
      ["RootCauseAnalysis", "Prioritization"],
      ["BusinessThinking", "Prioritization"],
      ["AnalyticalReasoning", "ProblemFraming"],
      ["DataQualityAwareness", "AnalyticalReasoning"],
      ["Communication", "BusinessThinking"]
    ];

    for (let r = 0; r < responseCount; r++) {
      const isCorrect = (i + r) % 3 !== 0; // 66% correct rate
      const maxScore = 10;
      const scoreEarned = isCorrect ? 10 : (3 + ((i + r) % 5)); // 3-7 score

      responses.push({
        missionId: `mission_${r + 1}`,
        taskId: `task_${r + 1}`,
        scoreEarned,
        maxScore,
        selectedOption: {
          title: missionNames[r],
          description: promptDetails[r],
          isCorrect,
        },
        textValue: isCorrect 
          ? "I isolated the issue by matching the timestamps across logs."
          : "I think the query might be missing index variables.",
        sliderValue: scoreEarned * 10,
        competenciesHit: compMapping[r],
      });
    }

    mockCandidates.push({
      id: `mock_${i + 1}`,
      name: candidate.name,
      email: candidate.email,
      phone: "+1 (555) 019-" + (1000 + i).toString().substring(1),
      degree,
      academicStatus,
      careerInterest,
      skills,
      dataComfort,
      dsFamiliarity,
      startedAt: startedAtDate.toISOString(),
      completedAt: completedAtDate ? completedAtDate.toISOString() : null,
      status,
      warningCount,
      warningEvents,
      result,
      responses,
      createdAt: startedAtDate.toISOString(),
    });
  }

  // Sort candidates by creation date descending
  return mockCandidates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
