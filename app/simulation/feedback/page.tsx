"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ArrowLeft, PlayCircle, Lock } from "lucide-react";

export default function FeedbackPage() {
  const router = useRouter();
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAttemptId(localStorage.getItem("simulationAttemptId"));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-12 select-none font-sans">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Custom Feedback Report</h1>
          <p className="text-sm text-slate-500 mt-1">Review specialized insights on strengths, development goals, and career paths.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Card wrapper */}
        <div className="bg-white border border-slate-150 rounded-2xl p-8 shadow-sm text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          
          <h2 className="text-xl font-black text-slate-900 mb-2">
            Feedback Report Locked
          </h2>
          
          <p className="text-sm text-slate-500 leading-relaxed mb-6 font-semibold">
            To unlock your comprehensive capability breakdown, archetype classification, and manager feedback, you must first complete the active assessment.
          </p>

          <button
            onClick={() => router.push(attemptId ? "/simulation/intro" : "/")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-95 text-white font-bold py-3.5 px-8 rounded-xl shadow-md shadow-indigo-100/50 transition-all hover:-translate-y-0.5 text-xs uppercase tracking-wider cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" /> 
            {attemptId ? "Resume Simulation Sandbox" : "Begin Assessment Setup"}
          </button>
        </div>

        {/* Back link */}
        <div className="flex justify-start pt-6 border-t border-slate-150">
          <button
            onClick={() => router.push("/simulation/intro")}
            className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
