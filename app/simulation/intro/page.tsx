"use client";

import React, { useState, Suspense } from "react";
import WelcomeCard from "@/components/simulation/WelcomeCard";
import MissionStepper from "@/components/simulation/MissionStepper";
import { EvaluatedOnCard, TipsCard } from "@/components/simulation/InfoCards";
import { useRouter } from "next/navigation";
import { Loader2, Rocket, AlertTriangle } from "lucide-react";
import Skeleton from "@/components/basic/Skeleton";
import ProctoringGuard from "@/components/simulation/ProctoringGuard";

function MissionStepperFallback() {
  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-12 w-48 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function SimulationIntroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setLoading(true);
    setError("");

    try {
      let candidateData = {
        name: "Guest",
        email: "guest@example.com",
        phone: "0000000000",
        degree: "",
        year: "",
        skills: [] as string[],
        confidence: 50,
      };

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("hiresapienCandidate");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            candidateData = { ...candidateData, ...parsed };
          } catch {
            // ignore parse error — use defaults
          }
        }
      }

      const res = await fetch("/api/simulation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start simulation. Please try again.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("simulationAttemptId", data.attemptId);
      }

      router.push("/simulation/mission/mission-1");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProctoringGuard>
      <div className="pb-16 space-y-8">
      {/* Welcome Banner */}
      <WelcomeCard />

      {/* Mission Roadmap */}
      <Suspense fallback={<MissionStepperFallback />}>
        <MissionStepper />
      </Suspense>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* Bottom Row: Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EvaluatedOnCard />
        <TipsCard />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* CTA Row */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-slate-400 font-medium">
          <span className="font-bold text-slate-600">Ready to prove your skills?</span>{" "}
          All missions unlock sequentially.
        </div>

        <button
          id="start-assessment-btn"
          onClick={handleStart}
          disabled={loading}
          className="flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-widest select-none cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting Engine…
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Begin the Assessment
            </>
          )}
        </button>
      </div>
    </div>
    </ProctoringGuard>
  );
}
