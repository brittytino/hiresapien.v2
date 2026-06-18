"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Lightbulb } from "lucide-react";

export default function StepWorkingStyle() {
  const router = useRouter();
  
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");

  const question1Options = [
    "Look for data before deciding",
    "Ask others for their opinions",
    "Follow proven approaches",
    "Trust my intuition"
  ];

  const question2Options = [
    "Finding patterns in information",
    "Building products and solutions",
    "Working with people",
    "Organizing and managing tasks"
  ];

  const question3Options = [
    "Discovering insights",
    "Solving complex problems",
    "Creating something useful",
    "Making business decisions"
  ];

  const handleContinue = () => {
    if (!q1 || !q2 || !q3) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboard_ws_q1", q1);
      sessionStorage.setItem("onboard_ws_q2", q2);
      sessionStorage.setItem("onboard_ws_q3", q3);
    }
    router.push("/sonascaledtatscientist/confidence");
  };

  const isFormValid = q1 && q2 && q3;

  const renderRadioGroup = (
    options: string[], 
    selectedValue: string, 
    onChange: (val: string) => void
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {options.map((option) => (
        <label 
          key={option} 
          className={`flex items-center px-4 py-3 border rounded-xl text-sm font-semibold cursor-pointer transition-all select-none
            ${selectedValue === option 
              ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" 
              : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30"}`}
        >
          <input 
            type="radio" 
            value={option} 
            checked={selectedValue === option} 
            onChange={() => onChange(option)} 
            className="hidden" 
          />
          <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 mr-3 transition-colors
            ${selectedValue === option ? 'border-blue-500' : 'border-slate-300'}`}>
            {selectedValue === option && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
          </div>
          <span className="flex-1">{option}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf4ff] via-[#f3f4f6] to-[#dbeafe]/80 relative overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-blue-500/20 selection:text-blue-900 px-4 py-12">
      
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
        <h1 className="text-3xl md:text-4xl font-black text-[#0C2340] tracking-tight leading-tight mb-8 select-none text-center">
          <Lightbulb className="w-8 h-8 text-[#2563FF] inline-block mb-1 mr-2" /> Let&apos;s understand how you <span className="text-[#2563FF]">approach problems.</span>
        </h1>

        <div className="w-full flex flex-col gap-8 text-left mb-10">
          
          {/* Question 1 */}
          <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
            <label className="block text-base font-bold text-[#0C2340]">When faced with a problem, I usually:</label>
            {renderRadioGroup(question1Options, q1, setQ1)}
          </div>

          {/* Question 2 */}
          <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
            <label className="block text-base font-bold text-[#0C2340]">I enjoy:</label>
            {renderRadioGroup(question2Options, q2, setQ2)}
          </div>

          {/* Question 3 */}
          <div className="bg-white/40 p-5 rounded-2xl border border-white/60">
            <label className="block text-base font-bold text-[#0C2340]">What excites you most?</label>
            {renderRadioGroup(question3Options, q3, setQ3)}
          </div>

        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-350 disabled:opacity-50 text-white font-extrabold py-4 px-8 rounded-xl shadow-lg disabled:shadow-none shadow-blue-600/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm select-none cursor-pointer w-full max-w-md"
        >
          <span>Continue</span>
          <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

    </div>
  );
}
