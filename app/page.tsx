"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, GraduationCap, Briefcase, Mail } from "lucide-react";

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    study: "",
    experience: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // In a real app, we'd save this to a global state or localStorage
      // For MVP, we'll store it in localStorage to access in the simulation
      if (typeof window !== "undefined") {
        localStorage.setItem("hiresapienLead", JSON.stringify(formData));
      }
      router.push("/hub");
    }
  };

  const steps = [
    {
      title: "Welcome to Hiresapien",
      subtitle: "Let's personalize your simulation experience.",
      icon: <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl mb-6">H</div>,
      content: (
        <p className="text-gray-600 text-center max-w-md mx-auto leading-relaxed">
          Get ready to step into real-world roles and solve industry problems. Before we begin, we just need a few details to tailor the experience to your background.
        </p>
      ),
      isValid: true,
    },
    {
      title: "What are you studying?",
      subtitle: "Select your current educational background.",
      icon: <GraduationCap className="w-12 h-12 text-blue-500 mb-6" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
          {["Computer Science", "Data Science", "Business Administration", "Engineering", "Arts & Humanities", "Other"].map((opt) => (
            <button
              key={opt}
              onClick={() => setFormData({ ...formData, study: opt })}
              className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${
                formData.study === opt 
                  ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm ring-2 ring-blue-600/20" 
                  : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      isValid: formData.study.length > 0,
    },
    {
      title: "Your Experience Level",
      subtitle: "How much industry experience do you have?",
      icon: <Briefcase className="w-12 h-12 text-blue-500 mb-6" />,
      content: (
        <div className="flex flex-col space-y-4 w-full max-w-lg">
          {["Student / No Experience", "0-1 Years", "1-3 Years", "3+ Years"].map((opt) => (
            <button
              key={opt}
              onClick={() => setFormData({ ...formData, experience: opt })}
              className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${
                formData.experience === opt 
                  ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm ring-2 ring-blue-600/20" 
                  : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      isValid: formData.experience.length > 0,
    },
    {
      title: "Final Step",
      subtitle: "Where should we send your results?",
      icon: <Mail className="w-12 h-12 text-blue-500 mb-6" />,
      content: (
        <div className="w-full max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow"
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
      ),
      isValid: formData.name.length > 2 && formData.email.includes("@") && formData.phone.length > 5,
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Progress Dots */}
      <div className="flex space-x-3 mb-12">
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === step ? "bg-blue-600 scale-125" : idx < step ? "bg-blue-300" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 w-full max-w-2xl flex flex-col items-center min-h-[500px]">
        {steps[step].icon}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">{steps[step].title}</h1>
        <p className="text-gray-500 mb-10 text-center">{steps[step].subtitle}</p>
        
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          {steps[step].content}
        </div>

        <div className="w-full mt-10 pt-8 border-t border-gray-100 flex justify-between items-center">
          {step > 0 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="text-gray-500 font-medium hover:text-gray-900 transition-colors"
            >
              Back
            </button>
          ) : <div></div>}

          <button 
            onClick={handleNext}
            disabled={!steps[step].isValid}
            className={`flex items-center px-8 py-3.5 rounded-xl font-bold transition-all shadow-md ${
              steps[step].isValid 
                ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-0.5" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {step === steps.length - 1 ? (
              <>Go to Dashboard <CheckCircle2 className="ml-2 w-5 h-5" /></>
            ) : (
              <>Continue <ArrowRight className="ml-2 w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
