"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Info, TrendingUp, BarChart2, FileText, Clock, Target, X, LogOut, ArrowLeft, User, Mail, Phone, GraduationCap, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";

interface CandidateData {
  name: string;
  email: string;
  phone: string;
  degree: string;
  year: string;
  skills: string[];
  confidence: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Guest");
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hiresapienCandidate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCandidate(parsed);
          if (parsed.name && parsed.name.trim()) {
            setUserName(parsed.name.trim());
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const getInitials = (name: string) => name.charAt(0).toUpperCase() || "G";

  const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (!pathname) return;
      if (pathname === "/simulation/intro") { setProgressVal(0); return; }
      if (pathname === "/simulation/result") { setProgressVal(100); return; }
      if (pathname.includes("/transition")) { setProgressVal(5); return; }

      const match = pathname.match(/\/simulation\/mission\/mission-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        let completed = num - 1;
        
        const raw = localStorage.getItem("hiresapienProgress");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed.completedMissions) {
              completed = Math.max(completed, parsed.completedMissions.length);
            }
          } catch {}
        }
        
        let val = Math.round((completed / 8) * 100);
        if (val === 0 && num === 1) val = 5; // Prevent 0% when starting
        setProgressVal(val);
      }
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000); // Check periodically for localStorage updates
    return () => clearInterval(interval);
  }, [pathname]);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressVal / 100) * circumference;

  const handleLogOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hiresapienCandidate");
    }
    router.push("/");
  };

  const navItems = [
    { label: "Simulation Flow", icon: LayoutDashboard, href: "/simulation/intro", section: "Assessment" },
    { label: "Instructions", icon: Info, href: "/simulation/instructions", section: "Assessment" },
    { label: "Results", icon: BarChart2, href: "/simulation/result", section: "Reports" },
    { label: "Feedback Report", icon: FileText, href: "/simulation/feedback", section: "Reports" },
  ];

  return (
    <>
      {/* ── Sidebar ─────────────────────────────────── */}
      <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-4 select-none">
        <div className="mb-8 px-2 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
            <Image
              src="/image-removebg-preview (1).png"
              alt="Hiresapien Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900 font-sans">
            Hire<span className="text-blue-600">Sapien</span>
          </h1>
        </div>

        <div className="flex-1">
          {/* Linear flow enforced. Navigation disabled during assessment. */}
        </div>

        {/* About this Simulation card */}
        <div className="mt-auto bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-sm text-gray-900 mb-1">About this Simulation</h3>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Step into the role of a Junior Data Scientist at ShopSphere and solve real business problems.
          </p>
          <div className="space-y-3">
            <div className="flex items-center text-xs text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-gray-400">15-20 mins</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Target className="w-4 h-4 mr-2" />
              <div>
                <p className="font-medium">Total Missions</p>
                <p className="text-gray-400">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Widget — click to open modal */}
        <button
          onClick={() => setShowProfile(true)}
          className="mt-4 w-full flex items-center space-x-3 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 transition-all hover:bg-slate-100/80 hover:border-indigo-200 cursor-pointer text-left"
        >
          <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle
                cx="22" cy="22" r="18" fill="none"
                stroke="#6366f1" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
              />
            </svg>
            <div className="w-6.5 h-6.5 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-sm z-10">
              {getInitials(userName)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-slate-800 truncate tracking-tight">{userName}</p>
            <p className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">Data Scientist Candidate</p>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[10px] font-black text-indigo-600">{progressVal}%</span>
            <p className="text-[8px] font-bold text-slate-400 leading-none">Done</p>
          </div>
        </button>
      </div>

      {/* ── Profile Modal ────────────────────────────── */}
      {showProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            style={{ animation: "modal-in 0.22s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            {/* Header band */}
            <div className="h-24 bg-gradient-to-br from-indigo-600 to-blue-500 relative flex items-end px-6 pb-4">
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              {/* Avatar */}
              <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-400 border-4 border-white flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {getInitials(userName)}
              </div>
            </div>

            {/* Body */}
            <div className="pt-12 px-6 pb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">{userName}</h2>
              <p className="text-xs font-semibold text-indigo-500 mb-5">Data Scientist Candidate</p>

              {/* Details */}
              <div className="space-y-3">
                {candidate?.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="truncate font-medium">{candidate.email}</span>
                  </div>
                )}
                {candidate?.phone && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="font-medium">{candidate.phone}</span>
                  </div>
                )}
                {candidate?.degree && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="font-medium">{candidate.degree}</span>
                  </div>
                )}
                {candidate?.year && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="font-medium">{candidate.year}</span>
                  </div>
                )}
                {candidate?.confidence !== undefined && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-xs text-slate-500">Confidence</span>
                        <span className="font-black text-xs text-indigo-600">{candidate.confidence}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"
                          style={{ width: `${candidate.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleLogOut}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all shadow-sm hover:shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes modal-in {
              from { opacity: 0; transform: scale(0.92) translateY(12px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
