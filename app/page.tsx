"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Terminal, UserCircle, GraduationCap, Briefcase, Zap, Loader2, CheckCircle2 } from "lucide-react";

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStage, setTransitionStage] = useState(0);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    degree: "",
    year: "",
    skills: [] as string[],
    confidence: 50,
  });

  const transitionMessages = [
    "Building Your Simulation...",
    "Analyzing Profile...",
    "Preparing Industry Scenario...",
    "Generating Workspace...",
    "Your first day at ShopSphere starts now."
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      startTransition();
    }
  };

  const startTransition = async () => {
    setIsTransitioning(true);
    setError("");

    // Start transition animation
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < transitionMessages.length) {
        setTransitionStage(stage);
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("hiresapienLead", JSON.stringify(formData));
      }

      const res = await fetch("/api/simulation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start simulation");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("simulationAttemptId", data.attemptId);
      }

      // Ensure at least 6 seconds pass for the animation
      setTimeout(() => {
        router.push("/simulation/mission/mission-1");
      }, Math.max(0, 6000 - (stage * 1200)));

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred starting the simulation.");
      setIsTransitioning(false);
      clearInterval(interval);
    }
  };

  const toggleSkill = (skill: string) => {
    if (skill === "None") {
      setFormData({ ...formData, skills: ["None"] });
      return;
    }
    const newSkills = formData.skills.filter(s => s !== "None");
    if (newSkills.includes(skill)) {
      setFormData({ ...formData, skills: newSkills.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...newSkills, skill] });
    }
  };

  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full">
          <Terminal className="w-12 h-12 text-blue-500 mb-8 animate-pulse mx-auto" />
          <div className="space-y-4">
            {transitionMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`transition-all duration-700 flex items-center ${
                  idx === transitionStage ? "opacity-100 transform translate-y-0 text-blue-400 font-bold text-xl" : 
                  idx < transitionStage ? "opacity-40 transform -translate-y-2 text-sm" : 
                  "opacity-0 transform translate-y-4 absolute"
                }`}
              >
                {idx < transitionStage && <CheckCircle2 className="w-4 h-4 mr-3 text-green-500" />}
                {idx === transitionStage && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
                {msg}
              </div>
            ))}
          </div>
          {error && <div className="mt-8 text-red-500 text-center">{error}</div>}
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: "Discover how industry-ready you are.",
      subtitle: "Experience a real-world Data Scientist simulation and receive a personalized competency report.",
      content: (
        <div className="space-y-4 w-full max-w-sm mt-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-4"></span>
            <span className="font-semibold text-gray-700">15 Minutes</span>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-4"></span>
            <span className="font-semibold text-gray-700">Industry-Based Scenarios</span>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-4"></span>
            <span className="font-semibold text-gray-700">Personalized Insights</span>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-4"></span>
            <span className="font-semibold text-gray-700">No Preparation Required</span>
          </div>
        </div>
      ),
      isValid: true,
      buttonText: "Start Assessment"
    },
    {
      title: "About You",
      subtitle: "Let's get to know you before we place you in the role.",
      icon: <UserCircle className="w-12 h-12 text-blue-500 mb-6" />,
      content: (
        <div className="w-full max-w-md space-y-4">
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-lg transition-colors bg-gray-50 focus:bg-white" />
          <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-lg transition-colors bg-gray-50 focus:bg-white" />
          <input type="tel" placeholder="Mobile Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-lg transition-colors bg-gray-50 focus:bg-white" />
        </div>
      ),
      isValid: formData.name.length > 2 && formData.email.includes("@") && formData.phone.length > 5,
    },
    {
      title: "Academic Profile",
      subtitle: "What are you currently pursuing?",
      icon: <GraduationCap className="w-12 h-12 text-blue-500 mb-6" />,
      content: (
        <div className="w-full max-w-lg space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {["B.Tech", "BCA", "MCA", "B.Sc", "M.Tech", "Other"].map(deg => (
              <button key={deg} onClick={() => setFormData({...formData, degree: deg})} className={`p-4 rounded-xl border-2 font-medium transition-all ${formData.degree === deg ? "border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-600/20" : "border-gray-100 bg-gray-50 text-gray-600 hover:border-blue-300"}`}>{deg}</button>
            ))}
          </div>
          {formData.degree && (
            <div className="animate-fade-in mt-6">
              <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Current Year</p>
              <div className="grid grid-cols-3 gap-3">
                {["1st", "2nd", "3rd", "Final Year", "Graduate"].map(yr => (
                  <button key={yr} onClick={() => setFormData({...formData, year: yr})} className={`p-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.year === yr ? "border-blue-600 bg-blue-50 text-blue-800" : "border-gray-100 bg-gray-50 text-gray-600"}`}>{yr}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
      isValid: formData.degree !== "" && formData.year !== "",
    },
    {
      title: "Experience Snapshot",
      subtitle: "Have you worked on any of the following?",
      icon: <Briefcase className="w-12 h-12 text-blue-500 mb-6" />,
      content: (
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {["Python", "SQL", "Excel", "Machine Learning", "Power BI/Tableau", "None"].map(skill => (
            <button 
              key={skill} 
              onClick={() => toggleSkill(skill)} 
              className={`p-4 rounded-xl border-2 flex items-center font-medium transition-all ${formData.skills.includes(skill) ? "border-blue-600 bg-blue-50 text-blue-800" : "border-gray-100 bg-gray-50 text-gray-600"}`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${formData.skills.includes(skill) ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"}`}>
                {formData.skills.includes(skill) && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              {skill}
            </button>
          ))}
        </div>
      ),
      isValid: formData.skills.length > 0,
    },
    {
      title: "Confidence Check",
      subtitle: "How confident are you in Data Science?",
      icon: <Zap className="w-12 h-12 text-yellow-500 mb-6" />,
      content: (
        <div className="w-full max-w-lg mt-8 px-4">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={formData.confidence}
            onChange={(e) => setFormData({...formData, confidence: parseInt(e.target.value)})}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-sm font-bold text-gray-400 mt-6 uppercase tracking-wide">
            <span className={formData.confidence < 30 ? "text-blue-600" : ""}>Just Exploring</span>
            <span className={formData.confidence >= 30 && formData.confidence <= 70 ? "text-blue-600 text-xl" : "text-xl"}>{formData.confidence}%</span>
            <span className={formData.confidence > 70 ? "text-blue-600" : ""}>Job Ready</span>
          </div>
        </div>
      ),
      isValid: true,
      buttonText: "Begin Simulation"
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-6 font-sans">
      
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto mt-8 mb-12">
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          <span>Progress</span>
          <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${((step + 1) / steps.length) * 100}%` }}></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {currentStep.icon}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 text-center leading-tight">{currentStep.title}</h1>
          <p className="text-xl text-gray-500 mb-12 text-center max-w-lg leading-relaxed">{currentStep.subtitle}</p>
          
          <div className="w-full flex flex-col items-center justify-center min-h-[250px]">
            {currentStep.content}
          </div>

          <div className="w-full mt-16 flex justify-between items-center">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="text-gray-400 font-bold hover:text-gray-900 transition-colors px-4 py-2">
                Back
              </button>
            ) : <div></div>}

            <button 
              onClick={handleNext}
              disabled={!currentStep.isValid}
              className={`flex items-center px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                currentStep.isValid 
                  ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-0.5" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              {currentStep.buttonText || "Continue"} <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
