"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2, CheckCircle2 } from "lucide-react";

function TransitionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    "Preparing Your Xperience...",
    "Analyzing Profile...",
    "Preparing Workplace Scenario...",
    "Setting Up Your Workspace...",
    "Loading Team Communications...",
    "Generating Mission Flow...",
    "Finalizing Experience..."
  ];

  useEffect(() => {
    let stepIndex = 0;
    
    // Total time ~ 3.5 seconds
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          // Automatically redirect to the target route
          const nextRoute = searchParams?.get("next") || "/simulation/mission/mission-1";
          setTimeout(() => {
            router.push(nextRoute);
          }, 800);
        }, 400); // short pause at 100%
      }
    }, 500);

    return () => clearInterval(interval);
  }, [router, searchParams]);

  return (
    <>
      {/* Decorative Radial Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 blur-[130px] rounded-full pointer-events-none" />

      {/* HireSapien Top-Left Branding */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1 shadow-sm">
          <Image
            src="/image-removebg-preview (1).png"
            alt="HireSapien Logo"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
        <span className="text-lg font-bold text-gray-900 font-sans tracking-tight hidden sm:block">
          Hire<span className="text-blue-600">Sapien</span>
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
        
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-white/40 border border-white/60 flex items-center justify-center mb-8 shadow-sm backdrop-blur-sm">
          {!isComplete ? (
            <Loader2 className="w-10 h-10 text-[#2563FF] animate-spin" />
          ) : (
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          )}
        </div>

        {!isComplete ? (
          <div className="w-full flex flex-col items-center">
            {/* Loading messages */}
            <div className="h-8 mb-6 flex items-center justify-center">
              <p className="text-slate-600 font-bold text-lg tracking-tight animate-pulse">
                {steps[currentStep]}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-[#2563FF] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${Math.min(((currentStep + 1) / steps.length) * 100, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="animate-[fadeIn_0.5s_ease-out_both] w-full flex flex-col items-center">
            <h2 className="text-2xl font-black text-[#0C2340] tracking-tight mb-2">Welcome to NovaCart.</h2>
            <p className="text-slate-500 font-semibold mb-8">Loading your first assignment...</p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default function SimulationTransitionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf4ff] via-[#f3f4f6] to-[#dbeafe]/80 relative overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-blue-500/20 selection:text-blue-900 px-6 py-8">
      <Suspense fallback={
        <div className="w-20 h-20 rounded-3xl bg-white/40 border border-white/60 flex items-center justify-center mb-8 shadow-sm backdrop-blur-sm relative z-10">
          <Loader2 className="w-10 h-10 text-[#2563FF] animate-spin" />
        </div>
      }>
        <TransitionContent />
      </Suspense>
    </div>
  );
}
