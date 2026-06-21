"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, ArrowRight, Loader2, Award, Info, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prefetch dashboard page
    router.prefetch("/admin");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in all credential fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        setError(data.error || "Authentication failed. Please verify credentials.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Unable to connect to authorization server.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col justify-between items-center font-sans selection:bg-blue-500/20 selection:text-blue-200 py-12 px-6">
      
      {/* Decorative Radial Backdrop Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Watermark Logo background */}
      <div className="absolute -left-20 sm:-left-28 bottom-[10%] w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] lg:w-[550px] lg:h-[550px] opacity-[0.03] select-none pointer-events-none -rotate-12 z-0">
        <Image
          src="/image-removebg-preview (1).png"
          alt="Watermark Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <header className="z-10 text-center animate-[fadeIn_0.4s_ease-out_both]">
        <div className="mb-2 flex justify-center">
          <Image
            src="/scale-removebg-preview.png"
            alt="Sona Scale Logo"
            width={150}
            height={36}
            className="object-contain"
          />
        </div>
      </header>

      {/* Main card */}
      <main className="w-full max-w-md relative z-10 flex flex-col gap-6 items-center">
        
        {/* Animated wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-8 rounded-3xl shadow-2xl flex flex-col gap-6"
        >
          <div className="text-center">
            <div className="inline-flex p-3 bg-blue-500/10 text-blue-400 rounded-2xl mb-3 border border-blue-500/10">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Institutional Entrance</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Authenticate access to Sona Scale analytics portal</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-xs font-semibold flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-xl transition-all flex items-center justify-center gap-2 select-none cursor-pointer mt-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Seeded Credentials Helper Card */}
          <div className="mt-2 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/60 flex items-start gap-3">
            <Info className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-[11px] font-semibold text-slate-400 leading-relaxed">
              <span className="text-white block font-black mb-1">Demo Credentials</span>
              <p>Username: <strong className="text-blue-300 font-mono">admin</strong></p>
              <p>Password: <strong className="text-blue-300 font-mono">SonaAdmin2026!</strong></p>
            </div>
          </div>

        </motion.div>
      </main>

      <footer className="z-10 text-center animate-[fadeIn_0.9s_ease-out_both]">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
          <span>Powered by</span>
          <Image
            src="/poweredby.png"
            alt="HireSapien Xperience"
            width={112}
            height={16}
            className="object-contain opacity-40"
          />
        </div>
      </footer>

    </div>
  );
}
