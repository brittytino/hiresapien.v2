"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";

export default function StepCareerInterest() {
  const router = useRouter();
  const [interest, setInterest] = useState("");

  const interests = [
    "Exploring career options",
    "Curious about Data Science",
    "Preparing for placements",
    "Building industry exposure",
    "Looking to discover my strengths",
    "Recommended by my institution"
  ];

  const handleContinue = () => {
    if (!interest) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboard_career_interest", interest);
    }
    router.push("/sonascaledtatscientist/skills");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf4ff] via-[#f3f4f6] to-[#dbeafe]/80 relative overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-blue-500/20 selection:text-blue-900 px-6">
      
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
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-[#0C2340] tracking-tight leading-tight mb-8 select-none text-center">
          <Compass className="w-8 h-8 text-[#2563FF] inline-block mb-1 mr-2" /> What brings you here <span className="text-[#2563FF]">today?</span>
        </h1>

        {/* Options Grid */}
        <div className="w-full max-w-md flex flex-col gap-3 mb-8 text-left">
          {interests.map((option) => (
            <label 
              key={option} 
              className={`flex items-center px-5 py-4 border rounded-xl text-sm font-semibold cursor-pointer transition-all select-none
                ${interest === option 
                  ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30"}`}
            >
              <input 
                type="radio" 
                name="career_interest" 
                value={option} 
                checked={interest === option} 
                onChange={() => setInterest(option)} 
                className="hidden" 
              />
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 mr-4 transition-colors
                ${interest === option ? 'border-blue-500' : 'border-slate-300'}">
                {interest === option && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
              </div>
              <span className="flex-1">{option}</span>
            </label>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          disabled={!interest}
          className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-350 disabled:opacity-50 text-white font-extrabold py-4 px-8 rounded-xl shadow-lg disabled:shadow-none shadow-blue-600/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm select-none cursor-pointer w-full max-w-md"
        >
          <span>Continue</span>
          <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

    </div>
  );
}
