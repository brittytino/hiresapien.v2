"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Building, FileText, Database, Mail, AlertTriangle } from "lucide-react";
import ProctoringGuard from "@/components/simulation/ProctoringGuard";

export default function FirstDayBriefingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidateName, setCandidateName] = useState("Junior Data Scientist");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hiresapienCandidate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setCandidateName(parsed.name);
        } catch {}
      }
    }
  }, []);

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
            // ignore parse error
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
        throw new Error(data.error || "Failed to initialize workspace.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("simulationAttemptId", data.attemptId);
      }

      router.push("/simulation/mission/mission-1");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProctoringGuard>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans flex justify-center">
        <div className="max-w-3xl w-full space-y-8">
          
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            {/* Corporate Header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-600" />
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">ShopSphere Intranet</h1>
                <p className="text-sm text-slate-500 font-medium mt-0.5">Secure Employee Memo System</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 mb-8">
              <div className="flex items-center gap-3 mb-4 text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-200 pb-3">
                <Mail className="w-4 h-4" /> Confidential Memo
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-y-2 text-sm">
                <span className="text-slate-500 font-medium">To:</span>
                <span className="font-bold text-slate-900">{candidateName} (New Hire)</span>
                
                <span className="text-slate-500 font-medium">From:</span>
                <span className="font-bold text-slate-900">Director of Data Science</span>
                
                <span className="text-slate-500 font-medium">Date:</span>
                <span className="font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
                
                <span className="text-slate-500 font-medium">Subject:</span>
                <span className="font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> URGENT: Revenue Drop Investigation
                </span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 space-y-5 text-sm md:text-base leading-relaxed">
              <p>
                Welcome to <strong>ShopSphere</strong>. We are a fast-growing e-commerce marketplace specializing in electronics and premium lifestyle products. Over the last quarter, we have scaled to over 2 million active users.
              </p>
              
              <p>
                However, you picked a chaotic day to join. The CEO has called an emergency board meeting for 4 PM because our top-line revenue dropped by 18% last week. Marketing blames Product, Product blames Logistics, and Leadership is looking to the Data team for objective answers.
              </p>

              <div className="bg-white border border-slate-200 p-5 rounded-xl my-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Database className="w-4 h-4 text-indigo-500" /> System Architecture Context
                </h3>
                <ul className="space-y-3 list-none p-0 m-0">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" />
                    <div>
                      <strong className="block text-slate-900 text-sm">Marketing Data</strong>
                      <span className="text-slate-500 text-xs">We track ad spend and CAC via integrations stored in Snowflake.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <strong className="block text-slate-900 text-sm">Product Telemetry</strong>
                      <span className="text-slate-500 text-xs">User behavior (clicks, add-to-cart, checkout) is logged via our frontend telemetry stream.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2" />
                    <div>
                      <strong className="block text-slate-900 text-sm">Logistics Database</strong>
                      <span className="text-slate-500 text-xs">Fulfillment centers log delivery times and return reasons into a PostgreSQL warehouse.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <p>
                Your role isn't just to write SQL queries or train models—you are here to <strong>find the truth hidden in the noise</strong>. You will be presented with raw data, dashboards, and stakeholder emails. You must analyze the evidence and make decisive business recommendations.
              </p>

              <div className="bg-slate-900 text-slate-300 p-5 rounded-xl mt-6 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-white font-bold text-sm">
                  <FileText className="w-4 h-4 text-indigo-400" /> Your Directive
                </div>
                <p className="text-xs leading-relaxed">
                  Proceed to your workspace. You have 8 urgent tasks to complete before the board meeting. Do not refresh your browser, as it will disrupt your secure VPN session. Good luck.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleStart}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Initializing Workspace...
                  </>
                ) : (
                  <>
                    Acknowledge Briefing & Begin <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </ProctoringGuard>
  );
}
