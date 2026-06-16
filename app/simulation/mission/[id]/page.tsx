"use client";

import React, { useState, useEffect, use } from "react";
import simulationData from "@/lib/simulation-data.json";
import {
  SingleSelectUI,
  MultiSelectUI,
  ShortTextUI,
  SliderUI,
  DashboardTableUI,
} from "@/components/simulation/InteractionComponents";
import { RankingUI } from "@/components/simulation/RankingUI";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2, AlertTriangle, Database, Check } from "lucide-react";
import ProctoringGuard from "@/components/simulation/ProctoringGuard";

// ── Progress indicator ─────────────────────────────────────────────────────
function MissionProgress({ missionId }: { missionId: string }) {
  const missions = simulationData.assessment.missions;
  const currentIdx = missions.findIndex((m) => m.id === missionId);
  const total = missions.length;

  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
        Mission {currentIdx + 1} of {total}
      </span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-700"
          style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
        />
      </div>
      <span className="text-xs font-bold text-indigo-600">
        {Math.round(((currentIdx + 1) / total) * 100)}%
      </span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answer, setAnswer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [missionComplete, setMissionComplete] = useState<{ num: number; title: string; nextId?: string } | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [checkingAttempt, setCheckingAttempt] = useState(true);

  const mission = simulationData.assessment.missions.find((m) => m.id === id);
  const missions = simulationData.assessment.missions;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("simulationAttemptId");
    if (stored) {
      setAttemptId(stored);
      setCheckingAttempt(false);
    } else {
      // Auto-start on the fly using saved candidate info
      const storedCandidate = localStorage.getItem("hiresapienCandidate");
      let candidateData = {
        name: "Guest",
        email: "guest@example.com",
        phone: "0000000000",
        degree: "",
        year: "",
        skills: [],
        confidence: 50,
      };
      if (storedCandidate) {
        try {
          const parsed = JSON.parse(storedCandidate);
          candidateData = { ...candidateData, ...parsed };
        } catch { /* ignore */ }
      }

      fetch("/api/simulation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.attemptId) {
            localStorage.setItem("simulationAttemptId", data.attemptId);
            setAttemptId(data.attemptId);
          }
          setCheckingAttempt(false);
        })
        .catch((err) => {
          console.error("Auto-start error:", err);
          setCheckingAttempt(false);
        });
    }
  }, []);

  // Reset answer when task/mission changes
  useEffect(() => {
    setAnswer(null);
    setError("");
  }, [currentTaskIndex, id]);

  if (checkingAttempt) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!attemptId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto mt-12">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">No Active Session Found</h2>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed mb-6 font-medium">
          To take this assessment, you must start from the simulation entrance page.
        </p>
        <button
          onClick={() => router.push("/simulation/intro")}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-100 cursor-pointer"
        >
          Return to Introduction
        </button>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Mission Not Found</h2>
        <p className="text-gray-500 mt-2">Mission ID "{id}" does not exist.</p>
      </div>
    );
  }

  const task: any = mission.tasks[currentTaskIndex];

  // Save progress to localStorage
  const saveProgress = (completedMissionNum: number, nextMissionNum: number | null) => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("hiresapienProgress");
    const prev = raw ? JSON.parse(raw) : { completedMissions: [] };
    const completedSet = new Set<number>(prev.completedMissions);
    completedSet.add(completedMissionNum);
    localStorage.setItem("hiresapienProgress", JSON.stringify({
      completedMissions: Array.from(completedSet),
      currentMission: nextMissionNum,
    }));
  };

  const handleSubmit = async () => {
    if (
      answer === null &&
      task.type !== "Slider" &&
      task.type !== "ShortText"
    ) {
      setError("Please select an answer before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const activeAttemptId = attemptId || localStorage.getItem("simulationAttemptId") || "";
      if (!activeAttemptId) {
        throw new Error(
          "No active simulation attempt found. Please return to the beginning."
        );
      }

      const submittedAnswer =
        task.type === "Slider" && answer === null ? 50 : answer;

      const res = await fetch("/api/simulation/submit-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: activeAttemptId,
          missionId: mission.id,
          taskId: task.id,
          answer: submittedAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit answer. Please try again.");
      }

      const missionIdx = missions.findIndex((m) => m.id === mission.id);
      const missionNum = missionIdx + 1;

      if (data.isComplete) {
        // All missions done
        saveProgress(missionNum, null);
        setMissionComplete({ num: missionNum, title: mission.title });
        setTimeout(() => router.push("/simulation/result"), 2200);
      } else if (data.nextMission && data.nextMission.id !== mission.id) {
        // Navigate to intro with completed + next params so roadmap animates
        const nextIdx = missions.findIndex((m) => m.id === data.nextMission.id);
        saveProgress(missionNum, nextIdx + 1);
        setMissionComplete({ num: missionNum, title: mission.title, nextId: data.nextMission.id });
        setTimeout(() => router.push(`/simulation/intro?justCompleted=${missionNum}&nextMission=${nextIdx + 1}`), 2200);
      } else {
        setCurrentTaskIndex((prev) => prev + 1);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isAnswered = (() => {
    if (task.type === "Slider") return true; // slider always has a value
    if (task.type === "ShortText") {
      if (typeof answer !== "string") return false;
      const wordCount = answer.trim() ? answer.trim().split(/\s+/).filter(Boolean).length : 0;
      return wordCount >= 50;
    }
    if (task.type === "MultiSelect") return Array.isArray(answer) && answer.length > 0;
    if (task.type === "Ranking") return Array.isArray(answer) && answer.length > 0;
    return answer !== null && answer !== undefined;
  })();

  return (
    <ProctoringGuard>
      <div className="pb-12 max-w-4xl mx-auto">

      {/* ── Mission Complete Overlay ─────────────────────────── */}
      {missionComplete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)" }}
        >
          <div style={{ animation: "mc-pop 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
            className="flex flex-col items-center text-center px-8">
            {/* Burst ring */}
            <div className="relative mb-6">
              <div style={{ animation: "mc-ring 0.6s ease-out 0.1s both" }}
                className="absolute inset-0 rounded-full border-4 border-emerald-400 opacity-0 scale-50" />
              <div style={{ animation: "mc-ring 0.8s ease-out 0.25s both" }}
                className="absolute inset-0 rounded-full border-2 border-emerald-300 opacity-0 scale-50" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <Check className="w-12 h-12 text-white stroke-[3px]" />
              </div>
            </div>
            <p className="text-emerald-400 text-sm font-black uppercase tracking-widest mb-2">Mission {missionComplete.num} Complete</p>
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">{missionComplete.title}</h2>
            <p className="text-slate-400 text-sm font-medium">
              {missionComplete.nextId ? "Loading next mission…" : "Calculating your results…"}
            </p>
          </div>
          <style>{`
            @keyframes mc-pop {
              from { opacity: 0; transform: scale(0.8) translateY(20px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes mc-ring {
              0%   { opacity: 0.8; transform: scale(0.5); }
              100% { opacity: 0;   transform: scale(2.2); }
            }
          `}</style>
        </div>
      )}

      {/* Mission Progress */}
      <MissionProgress missionId={id} />

      {/* Mission Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{mission.title}</h1>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 p-4 rounded-r-xl mt-4">
          <p className="text-gray-800 font-medium whitespace-pre-line text-sm leading-relaxed">
            {mission.context}
          </p>
        </div>
      </div>

      {/* Dashboard Data */}
      {(mission as any).dashboardData && (
        <div className="mb-10">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-indigo-600" /> Provided Data
          </h2>
          <DashboardTableUI data={(mission as any).dashboardData} />
        </div>
      )}

      {/* Task Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Task Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Task {currentTaskIndex + 1} of {mission.tasks.length}
            </span>
            <div className="flex gap-1 mt-1">
              {mission.tasks.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i < currentTaskIndex
                      ? "w-6 bg-green-400"
                      : i === currentTaskIndex
                      ? "w-6 bg-indigo-500"
                      : "w-4 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {task.type}
          </span>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h4 className="text-xl font-bold text-gray-900 leading-relaxed">
            {task.question}
          </h4>
        </div>

        {/* Interaction Components */}
        {task.type === "SingleSelect" && task.options && (
          <SingleSelectUI
            key={task.id}
            options={task.options}
            onSelect={(val) => setAnswer(val)}
          />
        )}

        {task.type === "MultiSelect" && task.options && (
          <MultiSelectUI
            key={task.id}
            options={task.options}
            onSelect={(val) => setAnswer(val)}
          />
        )}

        {task.type === "ShortText" && (
          <ShortTextUI key={task.id} onUpdate={(val) => setAnswer(val)} />
        )}

        {task.type === "Slider" && task.range && (
          <SliderUI
            key={task.id}
            range={task.range}
            onUpdate={(val) => setAnswer(val)}
          />
        )}

        {task.type === "Ranking" && task.items && (
          <RankingUI
            key={task.id}
            items={task.items}
            onUpdate={(ranked) => setAnswer(ranked)}
          />
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs font-semibold text-gray-400">
            {isAnswered ? (
              <span className="text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Answer captured
              </span>
            ) : (
              "Waiting for your input..."
            )}
          </div>

          <button
            id="submit-task-btn"
            onClick={handleSubmit}
            disabled={loading || (!isAnswered && task.type !== "Slider")}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 px-7 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit & Next <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    </ProctoringGuard>
  );
}
