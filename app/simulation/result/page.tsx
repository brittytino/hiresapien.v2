"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Award, Target, Brain, FileText, Zap, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const attemptId = localStorage.getItem("simulationAttemptId");
        if (!attemptId) throw new Error("No simulation attempt found.");

        const res = await fetch("/api/simulation/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId })
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to finalize simulation");
        }

        setResult(data.result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Calculating Readiness Level...</h2>
        <p className="text-gray-500">Evaluating your decisions against industry benchmarks.</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center max-w-lg">
          <h2 className="text-xl font-bold mb-2">Simulation Engine Offline</h2>
          <p className="text-sm opacity-90 mb-4">{error}</p>
          <p className="text-sm font-semibold">Note: For the application to grade responses, ensure your .env.local contains a valid MONGO_URI and the MongoDB cluster is running.</p>
        </div>
        <Link href="/hub" className="mt-6 text-blue-600 font-semibold hover:underline">
          Return to Hub
        </Link>
      </div>
    );
  }

  const { overallScore, readinessLevel, competencyScores } = result;

  // Map icons dynamically
  const iconMap: Record<string, any> = {
    "Problem Framing": Target,
    "Data Literacy": FileText,
    "Analytical Reasoning": Brain,
    "Business Thinking": Zap,
    "Communication": MessageSquare,
  };

  const competencies = Object.entries(competencyScores).map(([key, value]) => ({
    name: key,
    score: Math.round((value as number)),
    icon: iconMap[key] || Target
  }));

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="text-center mb-12 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simulation Complete!</h1>
        <p className="text-lg text-gray-600">Great job stepping into the role of a Junior Data Scientist.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-2">Overall Score</h2>
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
               <path
                 className="text-gray-100"
                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="3"
               />
               <path
                 className="text-blue-600 transition-all duration-1000 ease-out"
                 strokeDasharray={`${overallScore}, 100`}
                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="3"
               />
             </svg>
             <div className="absolute text-4xl font-bold text-gray-900">{overallScore}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-md p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <Award className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
          <h2 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2 z-10">Readiness Level</h2>
          <div className="text-3xl font-bold mb-4 z-10">{readinessLevel}</div>
          <p className="text-blue-100/80 text-sm z-10">
            {readinessLevel === "Industry Ready" ? "You demonstrate an exceptional grasp of real-world Data Science responsibilities." : 
             readinessLevel === "Industry Ready Foundation" ? "You show strong potential and a solid practical understanding of the core concepts." : 
             "You are developing your skills. Focus on bridging the gap between academic knowledge and business application."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Competency Breakdown</h3>
        <div className="space-y-6">
          {competencies.map((comp, idx) => {
            const Icon = comp.icon;
            return (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-700">{comp.name}</span>
                </div>
                <span className="font-bold text-gray-900">{comp.score}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${comp.score}%` }}
                ></div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/hub" className="text-blue-600 font-semibold hover:underline">
          Return to Dashboard
        </Link>
      </div>

    </div>
  );
}
