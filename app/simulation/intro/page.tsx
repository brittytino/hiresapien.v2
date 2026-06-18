"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, CheckCircle2, User, Building, Briefcase } from "lucide-react";

export default function IntroRolePage() {
  const router = useRouter();
  const [candidateName, setCandidateName] = useState("Candidate");

  useEffect(() => {
    // Only fetch name, no other proctoring here because it's handled in layout
    const storedName = sessionStorage.getItem("onboard_name") || localStorage.getItem("hiresapienCandidate");
    if (storedName) {
      setCandidateName(storedName);
    }
  }, []);

  const handleEnterWorkspace = () => {
    // Collect all data into localStorage before entering simulation
    if (typeof window !== "undefined") {
      const candidateData = {
        name: sessionStorage.getItem("onboard_name") || "Candidate",
        email: sessionStorage.getItem("onboard_email") || "",
        mobile: sessionStorage.getItem("onboard_mobile") || "",
        degree: sessionStorage.getItem("onboard_degree") || "",
        academic_status: sessionStorage.getItem("onboard_academic_status") || "",
        area_of_study: sessionStorage.getItem("onboard_area_of_study") || "",
        career_interest: sessionStorage.getItem("onboard_career_interest") || "",
        skills: JSON.parse(sessionStorage.getItem("onboard_skills") || "[]"),
        ws_q1: sessionStorage.getItem("onboard_ws_q1") || "",
        ws_q2: sessionStorage.getItem("onboard_ws_q2") || "",
        ws_q3: sessionStorage.getItem("onboard_ws_q3") || "",
        ds_familiarity: sessionStorage.getItem("onboard_ds_familiarity") || "50",
        data_comfort: sessionStorage.getItem("onboard_data_comfort") || "50",
        expectations: JSON.parse(sessionStorage.getItem("onboard_expectations") || "[]"),
        timestamp: new Date().toISOString()
      };
      
      // Save full profile
      localStorage.setItem("hiresapienCandidateProfile", JSON.stringify(candidateData));
      
      // Also keep the simple name for backward compatibility
      localStorage.setItem("hiresapienCandidate", candidateData.name);
      
      router.push("/simulation/transition");
    }
  };

  return (
    <div className="min-h-full h-full bg-slate-50 font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header Strip */}
        <div className="bg-[#0C2340] px-8 py-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center p-1.5 shadow-sm">
              <Image
                src="/image-removebg-preview (1).png"
                alt="HireSapien Logo"
                width={24}
                height={24}
                className="object-contain invert brightness-0"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-0.5">
                Hire<span className="text-white">Sapien</span>
              </div>
              <div className="text-sm font-medium">Your Role Today</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-300">
            <User className="w-4 h-4" />
            {candidateName}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-10">
          
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Data Science Associate</h1>
              <div className="flex items-center gap-2 text-slate-500 font-semibold mt-2">
                <Building className="w-4 h-4" />
                <span>NovaCart Analytics Team</span>
              </div>
            </div>
          </div>

          <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-600 mb-8 leading-relaxed">
            <p>
              Today you&apos;ll work through realistic workplace scenarios inspired by challenges faced by modern Data Science teams. You&apos;ll investigate problems, review business information, analyze evidence, and recommend actions based on the information available. 
            </p>
            <p>
              <strong>There are no right or wrong paths.</strong> Focus on how you think, explore, and make decisions.
            </p>
          </div>

          {/* Checklist */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 mb-10">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">During this experience you&apos;ll:</h3>
            <ul className="space-y-3">
              {[
                "Review stakeholder communications",
                "Investigate business challenges",
                "Analyze data-driven scenarios",
                "Make recommendations",
                "Discover your strengths"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={handleEnterWorkspace}
            className="group flex items-center justify-center gap-3 w-full bg-[#2563FF] hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-base cursor-pointer"
          >
            <span>Enter Workspace</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>
    </div>
  );
}
