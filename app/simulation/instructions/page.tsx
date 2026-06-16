"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, Lightbulb, ArrowLeft, PlayCircle, ShieldCheck, ShieldAlert } from "lucide-react";

export default function InstructionsPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto pb-12 select-none font-sans">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Simulation Instructions</h1>
          <p className="text-sm text-slate-500 mt-1">Read the following guidelines before beginning your simulation sandbox.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-50/60 to-blue-50/40 border border-indigo-100/60 rounded-2xl p-6">
          <h2 className="text-lg font-black text-slate-950 mb-3">Assessment Scenario Overview</h2>
          <p className="text-slate-600 leading-relaxed text-sm font-semibold">
            You will act as a <span className="font-bold text-slate-900">Junior Data Scientist</span> at <span className="font-bold text-slate-900">ShopSphere</span>, an e-commerce platform. Your core directive is to investigate why customer purchases and retention have dropped over the last quarter. You will be evaluated across 8 structured missions covering real-world analytical tasks.
            <span className="block mt-3 text-xs text-slate-450 font-medium italic">
              *Disclaimer: ShopSphere is a fictional company. Any resemblance to actual organizations, brands, or real-world events is entirely coincidental.
            </span>
          </p>
        </div>

        {/* Instructions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Structure */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Assessment Structure
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 font-semibold pl-1">
              <li className="flex items-start">
                <span className="mr-2 text-indigo-500">•</span>
                8 sequential missions with 1-4 interactive tasks each.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-indigo-500">•</span>
                Total estimated duration: 15 to 20 minutes.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-indigo-500">•</span>
                Tasks include MCQ, drag-and-drop ranking, and short explanations.
              </li>
            </ul>
          </div>

          {/* Box 2: Rules */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Best Practices & Rules
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 font-semibold pl-1">
              <li className="flex items-start">
                <span className="mr-2 text-indigo-500">•</span>
                Do not refresh or close the browser tab mid-assessment.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-indigo-500">•</span>
                Read the manager emails and slack alerts carefully.
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-indigo-500">•</span>
                Write professional responses just like in a real job.
              </li>
            </ul>
          </div>
        </div>

        {/* Tip section */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm mb-1">Important Tip: Think Professionally!</h4>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Every decision you make affects simulated project stakeholders. Analyze dashboard charts, SQL errors, and customer feedback data carefully before committing to your answers.
            </p>
          </div>
        </div>

        {/* Sentra Security & Proctoring Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                Sentra Security Proctoring System
              </h3>
              <p className="text-xs text-slate-400 font-medium">Real-time client-side enforcement & verification</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-semibold leading-relaxed mb-6">
            To ensure the integrity of this evaluation, the ShopSphere Assessment is secured by the <span className="text-indigo-400 font-bold">Sentra Proctoring Engine</span>. Your browser activity is monitored, and actions that compromise test security are strictly controlled.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Counting Violations (Red Warning Alert) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 mb-3 uppercase tracking-wider">
                  Counting Violation (Alert)
                </span>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed font-semibold">
                  Triggers a warning pop-up, increments the warning counter, and logs the action to the database. <span className="text-red-400 font-bold">Exceeding 5 violations triggers auto-submission and lock-out.</span>
                </p>
                
                <ul className="space-y-2 text-xs text-slate-300 pl-1 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500/80 mt-0.5">•</span>
                    <span><strong>Exiting Fullscreen:</strong> Fullscreen mode is mandatory and enforced.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500/80 mt-0.5">•</span>
                    <span><strong>Focus Lost:</strong> Tab-switching, window blurring, or minimizing the window.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500/80 mt-0.5">•</span>
                    <span><strong>Developer Tools:</strong> F12, inspecting elements, or resizing debug panel.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500/80 mt-0.5">•</span>
                    <span><strong>Clipboard Restrictions:</strong> Copy, Cut, or Paste actions (Ctrl+C, Ctrl+V, Ctrl+X).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500/80 mt-0.5">•</span>
                    <span><strong>Prohibited Shortcuts:</strong> PrintScreen, snipping tools, Win key, Alt+Tab, Alt+F4.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500/80 mt-0.5">•</span>
                    <span><strong>Inactivity:</strong> Being idle without mouse or keyboard inputs for more than 2 minutes.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Non-Counting Violations (Blackout Overlay) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 mb-3 uppercase tracking-wider">
                  Non-Counting Violation (Overlay)
                </span>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed font-semibold">
                  Suppresses browser action instantly and triggers a 3-second <span className="text-slate-200 font-bold">"SCREEN NO PROCTORING"</span> blackout overlay. These do not count toward your limit.
                </p>

                <ul className="space-y-2 text-xs text-slate-300 pl-1 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Right-Click:</strong> Context menu is entirely disabled.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Double-Click:</strong> Word selection by double-clicking is blocked.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Select All:</strong> Ctrl+A is disabled to prevent massive selection.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span><strong>Drag & Drop:</strong> Text dragging inside assessment is disabled.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Security heartbeat active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-150">
          <button
            onClick={() => router.push("/simulation/intro")}
            className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <button
            onClick={() => router.push("/simulation/intro")}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-95 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-indigo-100/50 transition-all hover:-translate-y-0.5 text-xs uppercase tracking-wider cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" /> Go to Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
