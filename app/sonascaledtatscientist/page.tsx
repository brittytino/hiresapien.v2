"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TrendingUp, ArrowRight, Clock, Briefcase, Sparkles, BrainCircuit } from "lucide-react";

export default function SonaSCALEDatascientistWelcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf4ff] via-[#f3f4f6] to-[#dbeafe]/80 relative overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-blue-500/20 selection:text-blue-900 px-6">
      
      {/* Decorative Radial Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 blur-[130px] rounded-full pointer-events-none" />

      {/* Faint Logo Watermark on the Left */}
      <div className="absolute -left-20 sm:-left-28 bottom-[10%] w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] lg:w-[550px] lg:h-[550px] opacity-[0.06] select-none pointer-events-none -rotate-12 z-0">
        <Image
          src="/image-removebg-preview (1).png"
          alt="Watermark Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Top Left Dots Pattern */}
      <div className="absolute top-12 left-12 w-24 h-24 opacity-30 pointer-events-none hidden sm:block">
        <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dotPattern1" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="#2563FF" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotPattern1)" />
        </svg>
      </div>

      {/* Bottom Right Dots Pattern */}
      <div className="absolute bottom-12 right-12 w-24 h-24 opacity-30 pointer-events-none hidden sm:block">
        <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dotPattern2" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="#2563FF" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotPattern2)" />
        </svg>
      </div>

      {/* Sona Scale Top-Left Branding */}
      

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center mt-8">
        
        {/* Top Scale Image (Above Headline) */}
        <div className="mb-4 animate-[fadeIn_0.4s_ease-out_both]">
          <Image
            src="/scale-removebg-preview.png"
            alt="Sona Scale"
            width={160}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Welcome Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0C2340] tracking-tight leading-tight mb-6 select-none animate-[fadeIn_0.5s_ease-out_both]">
          Data Science <span className="text-[#2563FF]">Xperience</span>
        </h1>

        {/* Subtext */}
        <p className="text-slate-600 text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mb-12 select-none animate-[fadeIn_0.6s_ease-out_both]">
          Experience the role of a Data Scientist through realistic workplace scenarios. Discover how your strengths align with data-driven problem solving.
        </p>

        {/* Experience Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12 animate-[fadeIn_0.7s_ease-out_both]">
          <div className="bg-white/60 backdrop-blur-sm border border-white p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">15–20 Minutes</span>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm border border-white p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Realistic Work Scenarios</span>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Personalized Insights</span>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-white p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">No Preparation Required</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/sonascaledtatscientist/about")}
          className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold py-4.5 px-10 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5 text-base select-none cursor-pointer w-72 md:w-80 animate-[fadeIn_0.8s_ease-out_both]"
        >
          <span>Start Xperience</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 w-full text-center z-20 animate-[fadeIn_0.9s_ease-out_both]">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <span>Powered by</span>
          <Image
            src="/poweredby.png"
            alt="HireSapien Xperience"
            width={156}
            height={24}
            className="object-contain opacity-70"
          />
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
