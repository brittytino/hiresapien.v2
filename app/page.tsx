"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Server, ShieldCheck, ChevronRight, Loader2, Key } from "lucide-react";

export default function ShopSpherePortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "", // Just for show / role play
  });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email) {
      setError("Authorization requires valid Name and Email credentials.");
      return;
    }

    setLoading(true);

    try {
      // Attempt to trigger fullscreen for immersion
      if (typeof window !== "undefined" && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch(() => {
          // ignore fullscreen errors if blocked by browser policy
        });
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("hiresapienCandidate", JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: "0000000000",
          degree: "Junior Data Scientist",
          year: "New Hire",
          skills: [],
          confidence: 100,
        }));
      }

      // Route to transition sequence
      setTimeout(() => {
        router.push("/simulation/transition");
      }, 800);

    } catch (err) {
      setLoading(false);
      setError("Failed to initialize secure environment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center font-mono selection:bg-indigo-500/30">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-stretch shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
        
        {/* Left Side: System Info */}
        <div className="hidden md:flex md:w-5/12 bg-slate-900/80 backdrop-blur-md p-10 flex-col justify-between border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center rounded-lg">
                <Server className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-widest uppercase">ShopSphere</h1>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Internal Network</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">System Status</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Core DB:</span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-slate-500">Analytics:</span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-slate-500">Logistics API:</span>
                  <span className="text-amber-400 font-bold animate-pulse">DEGRADED</span>
                </div>
              </div>

              <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Security Notice</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are accessing a restricted ShopSphere internal system. All activities are monitored by the Sentra protocol. Unauthorized access will be logged.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <Lock className="w-3.5 h-3.5" /> End-to-End Encrypted Session
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 bg-slate-950/90 backdrop-blur-xl p-10 lg:p-14 flex flex-col justify-center relative">
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Employee Authentication</h2>
            <p className="text-sm text-slate-400">Please provide your credentials to access the data warehouse.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-slate-200 text-sm outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Corporate Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-slate-200 text-sm outline-none transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Employee ID (Optional)
                </label>
                <div className="relative flex items-center">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3" />
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg pl-10 pr-4 py-3 text-slate-200 text-sm outline-none transition-colors"
                    placeholder="SS-XXXX"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Initialize Secure Workspace
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest">
              Secured by Sentra AI Protocol
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
