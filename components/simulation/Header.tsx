"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";

export default function Header() {
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hiresapienCandidate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name && parsed.name.trim()) {
            setUserName(parsed.name.trim());
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase() || "G";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-250 flex items-center justify-between px-6 select-none shadow-sm">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-gray-650 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2.5 cursor-pointer group bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 transition-all hover:bg-slate-100/50">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-sm">
            {getInitials(userName)}
          </div>
          <span className="text-xs font-black text-slate-700 tracking-tight">{userName}</span>
          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-650 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}
