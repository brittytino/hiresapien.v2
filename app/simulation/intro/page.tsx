"use client";

import React, { useState } from "react";
import WelcomeCard from "@/components/simulation/WelcomeCard";
import MissionStepper from "@/components/simulation/MissionStepper";
import { EvaluatedOnCard, TipsCard } from "@/components/simulation/InfoCards";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SimulationIntroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Retrieve lead info from onboarding
      let leadData = { name: "Guest", email: "guest@example.com", phone: "0000000000" };
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("hiresapienLead");
        if (stored) leadData = JSON.parse(stored);
      }

      // 2. Call API to create attempt
      const res = await fetch("/api/simulation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start simulation");
      }

      // 3. Store attempt ID and route
      if (typeof window !== "undefined") {
        localStorage.setItem("simulationAttemptId", data.attemptId);
      }
      
      router.push("/simulation/mission/mission-1");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12">
      <WelcomeCard />
      <MissionStepper />
      
      <div className="flex mt-12 gap-8 flex-col md:flex-row">
        <div className="flex-1">
          <EvaluatedOnCard />
        </div>
        <div className="flex-1">
          <TipsCard />
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-12 flex justify-end">
        <button 
          onClick={handleStart}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Starting Engine...
            </>
          ) : (
            "Start Assessment"
          )}
        </button>
      </div>
    </div>
  );
}
