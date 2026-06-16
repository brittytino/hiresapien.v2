"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  Briefcase,
  BarChart2,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Rocket,
} from "lucide-react";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  phone: string;
  degree: string;
  year: string;
  skills: string[];
  confidence: number;
}

// ──────────────────────────────────────────────
// Screen 1 — Welcome
// ──────────────────────────────────────────────
function WelcomeScreen({ onNext }: { onNext: () => void }) {
  const badges = [
    { icon: Clock, label: "15 Minutes" },
    { icon: Briefcase, label: "Industry-Based" },
    { icon: BarChart2, label: "Personalized Insights" },
    { icon: Lightbulb, label: "No Prep Needed" },
  ];

  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left py-4 font-sans">
      {/* Small badge */}
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 mb-6 uppercase tracking-wider">
        <Rocket className="w-4 h-4 mr-1.5" /> Interactive Sandbox Simulator
      </span>

      <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4 font-sans">
        Ready to discover your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
          industry readiness
        </span>
        ?
      </h1>

      <p className="text-base text-slate-500 leading-relaxed mb-8">
        We'll ask a few quick questions to customize your sandbox simulation. Your data is used only to generate your personalized performance scorecard.
      </p>

      {/* Feature Badges - shown in 2x2 grid on right side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
        {badges.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-3"
          >
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">{label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold text-base px-10 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
      >
        Start Assessment <ArrowRight className="w-5 h-5" />
      </button>

      <p className="text-xs text-slate-400 mt-6">
        No coding test experience or prior sign-up required.
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────
// Screen 2 — About You
// ──────────────────────────────────────────────
function AboutYouScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: FormData;
  onChange: (f: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.name.trim() || data.name.trim().length < 2)
      e.name = "Please enter your full name (min 2 characters).";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Please enter a valid email address.";
    if (!data.phone.trim() || !/^\+?[0-9\s\-]{8,15}$/.test(data.phone.replace(/\s/g, "")))
      e.phone = "Please enter a valid phone number (8–15 digits).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-black text-gray-900 mb-2">About You</h2>
      <p className="text-gray-500 mb-8">Help us personalize your simulation.</p>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Priya Sharma"
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all font-medium text-gray-900 placeholder-gray-400 ${
              errors.name
                ? "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="e.g. priya@example.com"
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all font-medium text-gray-900 placeholder-gray-400 ${
              errors.email
                ? "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="e.g. +91 98765 43210"
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all font-medium text-gray-900 placeholder-gray-400 ${
              errors.phone
                ? "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext} nextLabel="Continue" />
    </div>
  );
}

// ──────────────────────────────────────────────
// Screen 3 — Academic Profile
// ──────────────────────────────────────────────
function AcademicProfileScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: FormData;
  onChange: (f: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const degrees = ["B.Tech", "BCA", "MCA", "B.Sc", "M.Tech", "Other"];
  const years = ["1st Year", "2nd Year", "3rd Year", "Final Year", "Graduate"];

  const isDegreeOther = data.degree === "Other";

  // When "Other" degree is selected, year field holds the custom text — valid if non-empty
  // When a normal degree is selected, year must be one of the preset options
  const isValid = isDegreeOther
    ? data.degree.length > 0 && data.year.trim().length > 0
    : data.degree.length > 0 && data.year.length > 0;

  const handleDegreeClick = (deg: string) => {
    // Reset year whenever degree changes
    onChange({ degree: deg, year: "" });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-black text-gray-900 mb-2">Academic Profile</h2>
      <p className="text-gray-500 mb-8">Tell us about your educational background.</p>

      <div className="space-y-6">
        {/* Degree */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Degree
          </label>
          <div className="grid grid-cols-3 gap-3">
            {degrees.map((deg) => (
              <button
                key={deg}
                onClick={() => handleDegreeClick(deg)}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                  data.degree === deg
                    ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                {deg}
              </button>
            ))}
          </div>

          {/* Custom input when "Other" degree is selected — replaces Current Year */}
          {isDegreeOther && (
            <input
              type="text"
              autoFocus
              placeholder="e.g. Working Professional"
              value={data.year}
              onChange={(e) => onChange({ year: e.target.value })}
              className="mt-3 w-full px-4 py-3 border-2 border-indigo-300 rounded-xl outline-none text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          )}
        </div>

        {/* Current Year — hidden when degree is "Other" */}
        {!isDegreeOther && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Current Year
            </label>
            <div className="flex flex-col gap-2">
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => onChange({ year: yr })}
                  className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-semibold text-left transition-all ${
                    data.year === yr
                      ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} disabled={!isValid} />
    </div>
  );
}

// ──────────────────────────────────────────────
// Screen 4 — Experience Snapshot
// ──────────────────────────────────────────────
function ExperienceScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: FormData;
  onChange: (f: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const allSkills = ["Python", "SQL", "Excel", "Machine Learning", "Power BI / Tableau", "None"];

  const toggleSkill = (skill: string) => {
    if (skill === "None") {
      onChange({ skills: data.skills.includes("None") ? [] : ["None"] });
      return;
    }
    const withoutNone = data.skills.filter((s) => s !== "None");
    const updated = withoutNone.includes(skill)
      ? withoutNone.filter((s) => s !== skill)
      : [...withoutNone, skill];
    onChange({ skills: updated });
  };

  const isValid = data.skills.length > 0;

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-black text-gray-900 mb-2">Experience Snapshot</h2>
      <p className="text-gray-500 mb-8">
        Which tools or skills have you worked with? Select all that apply.
      </p>

      <div className="flex flex-col gap-3">
        {allSkills.map((skill) => {
          const isSelected = data.skills.includes(skill);
          return (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`flex items-center gap-4 py-4 px-5 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "border-indigo-600 bg-indigo-600" : "border-gray-300 bg-white"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`font-semibold text-sm ${isSelected ? "text-indigo-800" : "text-gray-700"}`}>
                {skill}
              </span>
            </button>
          );
        })}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} disabled={!isValid} />
    </div>
  );
}

// ──────────────────────────────────────────────
// Screen 5 — Confidence Check
// ──────────────────────────────────────────────
function ConfidenceScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: FormData;
  onChange: (f: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const getLabel = (val: number) => {
    if (val <= 20) return "Just Exploring";
    if (val <= 40) return "Learning the Basics";
    if (val <= 60) return "Building Confidence";
    if (val <= 80) return "Getting There";
    return "Job Ready";
  };

  const getColor = (val: number) => {
    if (val <= 30) return "from-blue-400 to-blue-500";
    if (val <= 60) return "from-indigo-400 to-indigo-600";
    return "from-violet-500 to-purple-600";
  };

  // Accurately tracks the thumb center across the full track width
  const thumbPos = { left: `calc(11px + (100% - 22px) * ${data.confidence / 100})` };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-black text-gray-900 mb-2">Confidence Check</h2>
      <p className="text-gray-500 mb-10">
        How confident are you in landing a Data Science role right now?
      </p>

      {/* Score Display */}
      <div className="flex flex-col items-center mb-10">
        <div
          className={`w-28 h-28 rounded-full bg-gradient-to-br ${getColor(data.confidence)} flex items-center justify-center shadow-lg mb-4`}
        >
          <span className="text-4xl font-black text-white">{data.confidence}</span>
        </div>
        <span className="text-lg font-bold text-gray-700">{getLabel(data.confidence)}</span>
      </div>

      {/* Slider */}
      <div className="relative px-2">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={data.confidence}
          onChange={(e) => onChange({ confidence: Number(e.target.value) })}
          className="confidence-slider"
          style={{
            background: `linear-gradient(90deg, #6366f1 ${data.confidence}%, #e5e7eb ${data.confidence}%)`,
          }}
        />
        <div className="flex justify-between text-xs font-semibold text-gray-400 mt-3">
          <span>0 — Just Exploring</span>
          <span>100 — Job Ready</span>
        </div>

        {/* Drag hint */}
        <div className="flex items-center justify-center gap-1.5 mt-2 opacity-30 select-none pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polyline points="15 18 9 12 15 6"/></svg>
          <span className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">drag to adjust</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Enter Simulation" isLast />
    </div>
  );
}

// ──────────────────────────────────────────────
// Shared Nav Buttons
// ──────────────────────────────────────────────
function NavButtons({
  onBack,
  onNext,
  disabled = false,
  nextLabel = "Continue",
  isLast = false,
}: {
  onBack: () => void;
  onNext: () => void;
  disabled?: boolean;
  nextLabel?: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
      <button
        onClick={onBack}
        className="text-gray-500 font-semibold hover:text-gray-900 transition-colors text-sm"
      >
        ← Back
      </button>
      <button
        onClick={onNext}
        disabled={disabled}
        className={`flex items-center gap-2 font-bold px-8 py-3 rounded-xl transition-all text-sm shadow-sm ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            : isLast
            ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:opacity-90 hover:-translate-y-0.5 shadow-md"
            : "bg-gray-900 text-white hover:bg-black hover:-translate-y-0.5"
        }`}
      >
        {nextLabel}{" "}
        {isLast ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Progress Bar
// ──────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = (step / total) * 100;
  return (
    <div className="w-full mb-10">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Step {step} of {total}
        </span>
        <span className="text-xs font-bold text-indigo-600">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Onboarding Flow
// ──────────────────────────────────────────────
const defaultForm: FormData = {
  name: "",
  email: "",
  phone: "",
  degree: "",
  year: "",
  skills: [],
  confidence: 50,
};

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultForm);

  const updateForm = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const handleFinish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hiresapienCandidate", JSON.stringify(formData));
    }
    router.push("/simulation/transition");
  };

  // Total screens after welcome (4 data steps)
  const totalDataSteps = 4;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-slate-50 font-sans">
      {/* Left Pane - Image & Hero Info */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-7/12 xl:w-3/5 bg-slate-950 flex-col justify-between p-12 lg:p-16 text-white overflow-hidden border-r border-slate-900 select-none">
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
          <Image
            src="/hero-illustration.png"
            alt="Data Science Workspace"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/70 to-transparent z-10" />

        {/* Hero content */}
        <div className="relative z-20 flex flex-col h-full justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg p-1.5">
              <Image
                src="/image-removebg-preview (1).png"
                alt="Hiresapien Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Hire<span className="text-blue-500">Sapien</span>
            </span>
          </div>

          {/* Tagline/details */}
          <div className="max-w-xl my-auto py-12">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
              Junior Data Scientist Simulator
            </p>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6 font-sans">
              Prove your skills in a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                real-world
              </span>{" "}
              environment.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Step into the shoes of a data professional. Solve real industry challenges, make data-driven decisions, and get a comprehensive competency scorecard.
            </p>

            {/* Feature points */}
            <div className="space-y-4">
              {[
                { label: "15 Minutes", desc: "Fast-paced simulation designed for busy candidates." },
                { label: "Industry-Based Scenarios", desc: "No textbook questions. Solve realistic business tasks." },
                { label: "Personalized Insights", desc: "Get detailed feedback on strengths and career archetype." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-indigo-400 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{item.label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer inside hero */}
          <div className="text-[10px] text-slate-500 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span>© {new Date().getFullYear()} HireSapien.</span>
              <span>·</span>
              <span>Privacy Policy</span>
            </div>
            <p className="opacity-75 leading-normal max-w-md">
              Disclaimer: ShopSphere is a fictional e-commerce company used strictly for simulated assessment purposes. Any resemblance to real brands, events, or companies is purely coincidental.
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Form steps */}
      <div className="w-full md:w-1/2 lg:w-5/12 xl:w-2/5 min-h-screen md:h-screen bg-white flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-y-auto">
        {/* On mobile, show logo */}
        <div className="flex md:hidden items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm p-1">
            <Image
              src="/image-removebg-preview (1).png"
              alt="Hiresapien Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            Hire<span className="text-blue-600">Sapien</span>
          </span>
        </div>

        <div className="my-auto w-full max-w-md mx-auto">
          {step > 0 && <ProgressBar step={step} total={totalDataSteps} />}

          {step === 0 && <WelcomeScreen onNext={goNext} />}

          {step === 1 && (
            <AboutYouScreen
              data={formData}
              onChange={updateForm}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 2 && (
            <AcademicProfileScreen
              data={formData}
              onChange={updateForm}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 3 && (
            <ExperienceScreen
              data={formData}
              onChange={updateForm}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 4 && (
            <ConfidenceScreen
              data={formData}
              onChange={updateForm}
              onNext={handleFinish}
              onBack={goBack}
            />
          )}
        </div>

        {/* Small footer at bottom of form side */}
        <div className="text-center md:text-left text-xs text-slate-400 mt-8 pt-4 border-t border-slate-50">
          Powered by Sentra AI
        </div>
      </div>
    </div>
  );
}
