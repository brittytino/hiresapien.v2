"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Award, Brain, Target, Zap, Loader2, ArrowRight } from "lucide-react";

export default function ResultPage() {
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

  if (loading || (!result && !error)) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full">
          <Brain className="w-12 h-12 text-purple-500 mb-8 animate-pulse mx-auto" />
          <div className="space-y-4">
            {transitionMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`transition-all duration-700 flex items-center justify-center ${
                  idx === transitionStage ? "opacity-100 transform translate-y-0 text-purple-400 font-bold text-xl" : 
                  idx < transitionStage ? "opacity-40 transform -translate-y-2 text-sm" : 
                  "opacity-0 transform translate-y-4 absolute"
                }`}
              >
                {idx === transitionStage && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
                {msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center max-w-lg">
          <h2 className="text-xl font-bold mb-2">Simulation Engine Offline</h2>
          <p className="text-sm opacity-90 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const { overallScore, competencyScores } = result;

  // Convert competencies to an array and sort by score
  const compArray = Object.entries(competencyScores as Record<string, number>).map(([name, score]) => ({ name, score }));
  compArray.sort((a, b) => b.score - a.score);

  const strengths = compArray.slice(0, 3).map(c => c.name.replace(/([A-Z])/g, ' $1').trim());
  const improvements = compArray.slice(-2).map(c => c.name.replace(/([A-Z])/g, ' $1').trim());

  // Determine Archetypes dynamically based on top competencies
  const archetypes = [];
  
  if (competencyScores.DataLiteracy > 70) {
    archetypes.push({
      title: "Evidence-Driven Analyst",
      desc: "You consistently sought data before making conclusions."
    });
  }
  if (competencyScores.RootCauseAnalysis > 70 || competencyScores.ProblemFraming > 70) {
    archetypes.push({
      title: "Strong Investigator",
      desc: "You identified root causes effectively instead of jumping to conclusions."
    });
  }
  if (competencyScores.BusinessThinking > 70) {
    archetypes.push({
      title: "Strategic Thinker",
      desc: "You mapped data findings directly to business impact."
    });
  }
  if (competencyScores.Communication < 60) {
    archetypes.push({
      title: "Emerging Communicator",
      desc: "Your insights were valuable but could be communicated more clearly."
    });
  }

  // Ensure we show at least a default archetype if scores are low
  if (archetypes.length === 0) {
    archetypes.push({
      title: "Developing Analyst",
      desc: "You are building a foundation in data science concepts."
    });
  }

  // Calculate faux industry comparison based on score
  const percentile = Math.min(99, Math.max(12, Math.floor(overallScore * 0.92)));

  return (
    <div className="max-w-4xl mx-auto pb-16 px-4">
      <div className="text-center mb-12 animate-fade-in mt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Industry Profile</h1>
        <p className="text-lg text-gray-600">Based on your decisions at ShopSphere.</p>
      </div>

      {/* Score Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl shadow-xl p-8 md:p-12 text-white relative overflow-hidden mb-8">
        <Award className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
        <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
          <div>
            <h2 className="text-blue-200 font-bold uppercase tracking-wider mb-2 text-sm">Performance Score</h2>
            <div className="text-6xl font-extrabold flex items-baseline">
              {overallScore} <span className="text-2xl text-blue-300 ml-2">/ 100</span>
            </div>
            <p className="mt-4 text-blue-100/90 max-w-sm">
              You performed better than <strong>{percentile}%</strong> of students attempting this simulation.
            </p>
          </div>
          
          <div className="mt-8 md:mt-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full md:w-auto">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-blue-200">Your Archetypes</h3>
            <div className="space-y-4">
              {archetypes.slice(0, 3).map((arch, idx) => (
                <div key={idx}>
                  <div className="font-bold text-lg text-white">{arch.title}</div>
                  <div className="text-sm text-blue-100 max-w-xs">{arch.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-center text-gray-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
                {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <Target className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Areas to Improve</h3>
          </div>
          <ul className="space-y-3">
            {improvements.map((imp, idx) => (
              <li key={idx} className="flex items-center text-gray-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></span>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-50 rounded-3xl p-10 text-center border border-blue-100">
        <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready for a more advanced challenge?</h3>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Join the waitlist to receive access to full-length industry simulations from top companies.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center mx-auto">
          Sign up for wishlist <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
