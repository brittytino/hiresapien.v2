"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, BarChart2 } from "lucide-react";

export default function StepConfidenceSnapshot() {
  const router = useRouter();
  
  const [familiarity, setFamiliarity] = useState<number>(50);
  const [comfort, setComfort] = useState<number>(50);

  const handleContinue = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboard_ds_familiarity", familiarity.toString());
      sessionStorage.setItem("onboard_data_comfort", comfort.toString());
    }
    router.push("/simulation/transition?next=/simulation/instructions");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf4ff] via-[#f3f4f6] to-[#dbeafe]/80 relative overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-blue-500/20 selection:text-blue-900 px-6 py-8">
      
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

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-[#0C2340] tracking-tight leading-tight mb-12 select-none text-center">
          <BarChart2 className="w-8 h-8 text-[#2563FF] inline-block mb-1 mr-2" /> How familiar are you with <span className="text-[#2563FF]">Data Science</span> today?
        </h1>

        <div className="w-full flex flex-col gap-12 text-left mb-12">
          
          {/* Slider 1: Familiarity */}
          <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/80 shadow-sm">
            <div className="relative pt-6 pb-2">
              <input
                type="range"
                min="0"
                max="100"
                value={familiarity}
                onChange={(e) => setFamiliarity(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563FF] hover:accent-blue-500 transition-all outline-none"
              />
              <div 
                className="absolute top-0 -ml-4 w-8 h-8 flex items-center justify-center"
                style={{ left: `calc(${familiarity}% + (${16 - familiarity * 0.32}px))` }}
              >
                <div className="bg-[#2563FF] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#2563FF]">
                  {familiarity}%
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 text-sm font-bold text-slate-500">
              <span>Just Exploring</span>
              <span>Very Confident</span>
            </div>
          </div>

          {/* Slider 2: Comfort */}
          <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/80 shadow-sm">
            <h3 className="text-lg font-black text-[#0C2340] mb-6">How comfortable are you with interpreting charts, reports, and data?</h3>
            <div className="relative pt-6 pb-2">
              <input
                type="range"
                min="0"
                max="100"
                value={comfort}
                onChange={(e) => setComfort(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563FF] hover:accent-blue-500 transition-all outline-none"
              />
              <div 
                className="absolute top-0 -ml-4 w-8 h-8 flex items-center justify-center"
                style={{ left: `calc(${comfort}% + (${16 - comfort * 0.32}px))` }}
              >
                <div className="bg-[#2563FF] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#2563FF]">
                  {comfort}%
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 text-sm font-bold text-slate-500">
              <span>Beginner</span>
              <span>Advanced</span>
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold py-4 px-8 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm select-none cursor-pointer w-full max-w-md"
        >
          <span>Continue</span>
          <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

    </div>
  );
}
