"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Award,
  Target,
  Brain,
  FileText,
  Zap,
  MessageSquare,
  TrendingUp,
  Database,
  RefreshCcw,
  ArrowRight,
  Sparkles,
  Compass,
  ListRestart
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Loading Messages ────────────────────────────────────────────────────────
const LOADING_MESSAGES = [
  "Analyzing Your Decisions...",
  "Comparing Against Industry Benchmarks...",
  "Evaluating Business Reasoning...",
  "Evaluating Data Interpretation...",
  "Preparing Your Report...",
];

function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => Math.min(prev + 1, LOADING_MESSAGES.length - 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center select-none font-sans">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-gray-105/50" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-blue-500 animate-spin"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-8 h-8 text-indigo-650" />
        </div>
      </div>
      <h2 className="text-xl font-black text-gray-900 mb-2 transition-all duration-500">
        {LOADING_MESSAGES[msgIdx]}
      </h2>
      <p className="text-gray-400 text-sm font-semibold">
        Calculating capability indexes...
      </p>
    </div>
  );
}

// ── Readiness Level Config ──────────────────────────────────────────────────
function getReadinessConfig(level: string) {
  const configs: Record<string, { color: string; bg: string; desc: string }> = {
    "Industry Ready": {
      color: "text-emerald-350",
      bg: "from-emerald-950 via-teal-900 to-slate-900",
      desc: "You demonstrate an exceptional grasp of real-world Data Science responsibilities. You think like an analyst, communicate like a strategist, and act with data-driven precision.",
    },
    "Industry Ready Foundation": {
      color: "text-blue-355",
      bg: "from-indigo-950 via-blue-900 to-slate-900",
      desc: "You show strong potential and a solid practical understanding of core concepts. With targeted practice, you're very close to being industry-ready.",
    },
    "Emerging Professional": {
      color: "text-amber-350",
      bg: "from-amber-950 via-orange-900 to-slate-900",
      desc: "You are building your skills and developing the right instincts. Focus on bridging the gap between academic knowledge and real business application.",
    },
    Explorer: {
      color: "text-purple-350",
      bg: "from-purple-950 via-violet-900 to-slate-900",
      desc: "You're at the beginning of an exciting journey. Every expert was once an Explorer. Use this report to find your focus areas and grow.",
    },
  };
  return configs[level] || configs["Explorer"];
}

// ── Score Ring ──────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#6366f1" : score >= 40 ? "#f59e0b" : "#8b5cf6";

  return (
    <div className="relative w-44 h-44 flex items-center justify-center select-none">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          style={{ transition: "stroke-dasharray 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-black text-gray-900 tracking-tight">{score}</div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Score</div>
      </div>
    </div>
  );
}

// ── Competency Icon Map ─────────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  ProblemFraming: Target,
  DataLiteracy: FileText,
  AnalyticalReasoning: Brain,
  RootCauseAnalysis: TrendingUp,
  Prioritization: Zap,
  BusinessThinking: Award,
  DataQualityAwareness: Database,
  Communication: MessageSquare,
};

const labelMap: Record<string, string> = {
  ProblemFraming: "Problem Framing",
  DataLiteracy: "Data Literacy",
  AnalyticalReasoning: "Analytical Reasoning",
  RootCauseAnalysis: "Root Cause Analysis",
  Prioritization: "Prioritization",
  BusinessThinking: "Business Thinking",
  DataQualityAwareness: "Data Quality Awareness",
  Communication: "Communication",
};

// ── Main Results Page ───────────────────────────────────────────────────────
export default function ResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transitionStage, setTransitionStage] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const transitionMessages = [
    "Analyzing Your Decisions...",
    "Comparing Against Industry Benchmarks...",
    "Evaluating Business Reasoning...",
    "Evaluating Data Interpretation..."
  ];

  useEffect(() => {
    // Start transition animation
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < transitionMessages.length) {
        setTransitionStage(stage);
      }
    }, 1500);

    const fetchResults = async () => {
      const minDelay = new Promise((res) => setTimeout(res, 3500));

      try {
        const attemptId = localStorage.getItem("simulationAttemptId");
        if (!attemptId) throw new Error("No simulation attempt found. Please restart the assessment.");

        // Check if all 8 missions are completed
        const progressRaw = localStorage.getItem("hiresapienProgress");
        let isAllCompleted = false;
        if (progressRaw) {
          try {
            const parsed = JSON.parse(progressRaw);
            const completed = parsed.completedMissions || [];
            if (completed.length >= 8) {
              isAllCompleted = true;
            }
          } catch {
            // ignore
          }
        }

        if (!isAllCompleted) {
          throw new Error("You must complete all 8 simulation missions before you can view your results.");
        }

        const [res] = await Promise.all([
          fetch("/api/simulation/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ attemptId }),
          }),
          minDelay,
        ]);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to calculate results.");
        }

        setResult(data.result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong loading your results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // Ensure transition takes at least 6 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
      clearInterval(interval);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleRetake = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("simulationAttemptId");
      localStorage.removeItem("hiresapienCandidate");
    }
    router.push("/");
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 font-sans">
        <div className="p-8 bg-red-50 rounded-2xl border border-red-200 max-w-md shadow-sm">
          <h2 className="text-xl font-black text-red-700 mb-2">Could Not Load Results</h2>
          <p className="text-red-650 text-sm mb-6 font-semibold">{error}</p>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            Make sure your server is running with valid credentials.
          </p>
        </div>
        <button
          onClick={handleRetake}
          className="mt-6 flex items-center gap-2 text-indigo-600 font-extrabold hover:text-indigo-800 transition-colors uppercase text-xs tracking-wider"
        >
          <RefreshCcw className="w-4 h-4" /> Retake Assessment
        </button>
      </div>
    );
  }

  const {
    overallScore,
    readinessLevel,
    competencyScores,
    archetype,
    strengths = [],
    improvements = [],
    completedAt,
  } = result;

  const readinessConfig = getReadinessConfig(readinessLevel);

  const competencies = Object.entries(competencyScores as Record<string, number>).map(
    ([key, value]) => ({
      key,
      label: labelMap[key] || key,
      score: Math.round(value as number),
      icon: iconMap[key] || Target,
    })
  );

  const formattedDate = completedAt
    ? new Date(completedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const getIndustryComparison = (score: number) => {
    if (score >= 80) return "Top 5% of entry-level candidates";
    if (score >= 60) return "Top 15% of entry-level candidates";
    if (score >= 40) return "Top 35% of entry-level candidates";
    return "Top 60% of entry-level candidates";
  };

  // Find lowest score domain for actionable recommendation
  const weakestCompetency = competencies.reduce((min, curr) => 
    curr.score < min.score ? curr : min
  , competencies[0] || { key: "DataLiteracy", label: "Data Literacy", score: 100 });

  const getRecommendationText = (key: string) => {
    const recs: Record<string, string> = {
      ProblemFraming: "Focus on breaking down vague stakeholder requests into concrete, testable statistical hypothesis statements.",
      DataLiteracy: "Study multi-metric behavioral cohort analysis and practice scanning funnel charts under time pressure.",
      AnalyticalReasoning: "Dedicate time to structuring A/B testing validation hypotheses before drawing database conclusions.",
      RootCauseAnalysis: "Leverage the structured '5-Why' investigative framework when debugging telemetry drops.",
      Prioritization: "Apply an Eisenhower Matrix to weigh the commercial urgency vs technical complexity of requests.",
      BusinessThinking: "Practice mapping data fluctuations directly to corporate financial models (CAC, LTV, revenue).",
      DataQualityAwareness: "Spend time analyzing database constraints and common pipeline telemetry failures (NULL values, duplicated rows).",
      Communication: "Draft short executive summaries (TL;DR) for metrics fluctuations, highlighting core findings and recommendations first.",
    };
    return recs[key] || "Investigate broad user metrics systematically before finalizing statistical conclusions.";
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 font-sans">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="text-center mb-10 select-none">
        <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">Simulation Complete!</h1>
        <p className="text-gray-500 max-w-md mx-auto text-sm font-semibold">
          You've completed the ShopSphere Data Scientist simulation. Here's your personalized competency report.
        </p>
        {formattedDate && (
          <p className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-wider">Completed: {formattedDate}</p>
        )}
      </div>

      {/* ── Score + Readiness ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 select-none">
        {/* Score Ring Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-150 p-6 md:p-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
            Overall Readiness Score
          </h2>
          <ScoreRing score={overallScore} />
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-650 mt-6 tracking-wide border border-indigo-100/50">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> {getIndustryComparison(overallScore)}
          </span>
        </div>

        {/* Readiness Band Card */}
        <div
          className={`bg-gradient-to-br ${readinessConfig.bg} rounded-2xl shadow-md p-6 md:p-8 flex flex-col justify-between text-white relative overflow-hidden`}
        >
          <Award className="absolute -bottom-6 -right-6 w-36 h-36 text-white/10 select-none pointer-events-none" />
          <div className="z-10">
            <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">
              Readiness Level
            </p>
            <div className={`text-3xl font-black mb-3 leading-none ${readinessConfig.color}`}>
              {readinessLevel}
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed z-10 font-semibold mt-4">
            {readinessConfig.desc}
          </p>
        </div>
      </div>

      {/* ── Profile Archetype ───────────────────────────────────────────── */}
      {archetype && (
        <div className="bg-gradient-to-r from-indigo-50/60 to-purple-50/40 border border-indigo-100/60 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-5 select-none">
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 border border-indigo-100">
            <Compass className="w-7 h-7 text-indigo-600 animate-spin-slow" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">
              Your Profile Archetype
            </p>
            <h3 className="text-xl font-black text-indigo-900">{archetype}</h3>
          </div>
        </div>
      )}

      {/* ── Actionable Top Recommendation ───────────────────────────────── */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 mb-8 flex items-start gap-4 select-none">
        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 mb-1">Top Actionable Recommendation</h4>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
            Priority focus: Improve {weakestCompetency.label} ({weakestCompetency.score}%)
          </p>
          <p className="text-sm text-slate-600 font-semibold leading-relaxed">
            {getRecommendationText(weakestCompetency.key)}
          </p>
        </div>
      </div>

      {/* ── Strengths + Areas to Improve ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-150 p-6 select-none">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Your Strengths
          </h3>
          {strengths.length > 0 ? (
            <ul className="space-y-3">
              {strengths.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-50 border border-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-650 leading-normal">{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 font-semibold">Complete more missions to reveal strengths.</p>
          )}
        </div>

        {/* Areas to Improve */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-150 p-6 select-none">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-600" /> Areas to Improve
          </h3>
          {improvements.length > 0 ? (
            <ul className="space-y-3">
              {improvements.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <ArrowRight className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-650 leading-normal">{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 font-semibold">You've shown strength across all areas!</p>
          )}
        </div>
      </div>

      {/* ── Competency Breakdown ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-150 p-6 md:p-8 mb-10 select-none">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> Competency Breakdown
        </h3>
        <div className="space-y-5">
          {competencies.map(({ key, label, score, icon: Icon }) => {
            const barColor =
              score >= 75
                ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                : score >= 50
                ? "bg-gradient-to-r from-indigo-400 to-blue-500"
                : "bg-gradient-to-r from-amber-400 to-orange-400";

            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-450" />
                    </div>
                    <span className="text-xs font-black text-slate-700 tracking-tight">{label}</span>
                  </div>
                  <span
                    className={`text-xs font-black ${
                      score >= 75
                        ? "text-emerald-600"
                        : score >= 50
                        ? "text-indigo-650"
                        : "text-amber-650"
                    }`}
                  >
                    {score}%
                  </span>
                </div>
                <div className="h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          id="retake-assessment-btn"
          onClick={handleRetake}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-95 text-white font-bold px-8 py-3.5 rounded-xl shadow-md shadow-indigo-100/50 transition-all hover:-translate-y-0.5 text-xs uppercase tracking-wider cursor-pointer"
        >
          <ListRestart className="w-4 h-4" /> Retake Assessment
        </button>
        <Link
          href="#"
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-slate-550 font-bold hover:text-slate-800 transition-colors px-8 py-3.5 rounded-xl border border-slate-200 hover:border-slate-350 text-xs uppercase tracking-wider"
        >
          Sign Up for Beta <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
