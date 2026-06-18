"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Wrench } from "lucide-react";

export default function StepExperienceSnapshot() {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills = [
    "Excel or Google Sheets",
    "Data Visualization",
    "SQL",
    "Python",
    "Statistics",
    "Machine Learning",
    "Power BI or Tableau",
    "Hackathons or Competitions",
    "Personal Projects",
    "None Yet"
  ];

  const toggleSkill = (skill: string) => {
    if (skill === "None Yet") {
      setSelectedSkills(["None Yet"]);
      return;
    }

    setSelectedSkills((prev) => {
      const filtered = prev.filter(s => s !== "None Yet");
      if (filtered.includes(skill)) {
        return filtered.filter((s) => s !== skill);
      }
      return [...filtered, skill];
    });
  };

  const handleContinue = () => {
    if (selectedSkills.length === 0) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboard_skills", JSON.stringify(selectedSkills));
    }
    router.push("/sonascaledtatscientist/workingstyle");
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
        <h1 className="text-3xl md:text-4xl font-black text-[#0C2340] tracking-tight leading-tight mb-8 select-none text-center">
          <Wrench className="w-8 h-8 text-[#2563FF] inline-block mb-1 mr-2" />
          Have you explored any of the <span className="text-[#2563FF]">following?</span>
        </h1>

        <p className="text-slate-500 text-sm md:text-base font-semibold mb-8 select-none">
          Select all that apply.
        </p>

        {/* Skills Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left">
          {skills.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`flex items-center px-4 py-3.5 border rounded-xl text-sm font-semibold transition-all select-none
                  ${isSelected 
                    ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" 
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30"}`}
              >
                <div className={`flex items-center justify-center w-5 h-5 rounded border mr-3 transition-colors
                  ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="flex-1 text-left">{skill}</span>
              </button>
            );
          })}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          disabled={selectedSkills.length === 0}
          className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-350 disabled:opacity-50 text-white font-extrabold py-4 px-8 rounded-xl shadow-lg disabled:shadow-none shadow-blue-600/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm select-none cursor-pointer w-full max-w-md"
        >
          <span>Continue</span>
          <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

    </div>
  );
}
