"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Mail, Phone, ArrowRight } from "lucide-react";

export default function StepAboutYou() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidMobile = (mobile: string) => {
    const cleaned = mobile.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const isFormValid = formData.name.trim().length > 0 && 
                      isValidEmail(formData.email) && 
                      isValidMobile(formData.mobile);

  const handleContinue = () => {
    if (!isFormValid) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboard_name", formData.name.trim());
      sessionStorage.setItem("onboard_email", formData.email.trim());
      sessionStorage.setItem("onboard_mobile", formData.mobile.trim());
    }
    router.push("/sonascaledtatscientist/degree");
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
        <span className="text-lg font-bold text-gray-900 font-sans tracking-tight">
          Hire<span className="text-blue-600">Sapien</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-[#0C2340] tracking-tight leading-tight mb-3 select-none">
          Let&apos;s Get <span className="text-[#2563FF]">Started</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm md:text-base font-medium mb-8 select-none max-w-md">
          Before we begin, we&apos;d like to know a little about you. This helps us personalize your experience and tailor your insights at the end of the simulation.
        </p>

        {/* Form Fields */}
        <div className="w-full max-w-md flex flex-col gap-4 mb-8">
          
          <div className="relative flex items-center">
            <User className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Full Name" 
              className="w-full bg-white border border-slate-200/80 focus:border-[#2563FF] rounded-xl pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-700 placeholder-slate-400 shadow-sm outline-none transition-all"
            />
          </div>

          <div className="relative flex items-center">
            <Mail className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Email Address" 
              className="w-full bg-white border border-slate-200/80 focus:border-[#2563FF] rounded-xl pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-700 placeholder-slate-400 shadow-sm outline-none transition-all"
            />
          </div>

          <div className="relative flex items-center">
            <Phone className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input 
              type="tel" 
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              placeholder="Mobile Number" 
              className="w-full bg-white border border-slate-200/80 focus:border-[#2563FF] rounded-xl pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-700 placeholder-slate-400 shadow-sm outline-none transition-all"
            />
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
