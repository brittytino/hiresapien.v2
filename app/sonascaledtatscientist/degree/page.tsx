"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ArrowRight, BookOpen } from "lucide-react";

export default function StepAcademicBackground() {
  const router = useRouter();
  
  const [degree, setDegree] = useState("");
  const [status, setStatus] = useState("");
  const [areaOfStudy, setAreaOfStudy] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const degrees = [
    "B.E / B.Tech",
    "B.Sc",
    "BCA",
    "MCA",
    "M.Tech",
    "M.Sc",
    "Other"
  ];

  const statuses = [
    "First Year",
    "Second Year",
    "Third Year",
    "Final Year",
    "Graduate"
  ];

  const handleContinue = () => {
    if (!degree || !status || !areaOfStudy.trim()) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboard_degree", degree);
      sessionStorage.setItem("onboard_academic_status", status);
      sessionStorage.setItem("onboard_area_of_study", areaOfStudy.trim());
    }
    router.push("/sonascaledtatscientist/career");
  };

  const isFormValid = degree && status && areaOfStudy.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf4ff] via-[#f3f4f6] to-[#dbeafe]/80 relative overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-blue-500/20 selection:text-blue-900 px-4 py-8">
      
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
        <h1 className="text-3xl md:text-4xl font-black text-[#0C2340] tracking-tight leading-tight mb-8 select-none">
          Tell us about your <span className="text-[#2563FF]">academic journey.</span>
        </h1>

        <div className="w-full max-w-md flex flex-col gap-8 text-left mb-8">
          
          {/* Question 1: Degree */}
          <div>
            <label className="block text-sm font-bold text-[#0C2340] mb-2">What are you currently pursuing?</label>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-slate-200/80 focus:border-[#2563FF] rounded-xl px-5 py-3.5 text-left text-sm font-semibold text-slate-700 flex items-center justify-between shadow-sm outline-none transition-all cursor-pointer"
              >
                <span>{degree || "Select Degree"}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-2 overflow-hidden animate-[scaleIn_0.2s_ease-out_both] max-h-60 overflow-y-auto">
                  {degrees.map((d, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDegree(d);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50/50 hover:text-[#2563FF] transition-colors cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Question 2: Academic Status */}
          <div>
            <label className="block text-sm font-bold text-[#0C2340] mb-3">Current Academic Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {statuses.map((s) => (
                <label 
                  key={s} 
                  className={`flex items-center justify-center px-3 py-3 border rounded-xl text-sm font-semibold cursor-pointer transition-all select-none
                    ${status === s 
                      ? "bg-blue-50 border-blue-500 text-blue-700" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30"}`}
                >
                  <input 
                    type="radio" 
                    name="academic_status" 
                    value={s} 
                    checked={status === s} 
                    onChange={() => setStatus(s)} 
                    className="hidden" 
                  />
                  <span className="text-center">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 3: Area of Study */}
          <div>
            <label className="block text-sm font-bold text-[#0C2340] mb-2">Area of Study</label>
            <div className="relative flex items-center">
              <BookOpen className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input 
                type="text" 
                value={areaOfStudy}
                onChange={(e) => setAreaOfStudy(e.target.value)}
                placeholder="Computer Science, Data Science, Artificial Intelligence..." 
                className="w-full bg-white border border-slate-200/80 focus:border-[#2563FF] rounded-xl pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-700 placeholder-slate-400 shadow-sm outline-none transition-all"
              />
            </div>
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

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.97) translateY(-5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

    </div>
  );
}
