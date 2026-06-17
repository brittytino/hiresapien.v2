"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function TransitionPage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);

  const messages = [
    "Establishing secure tunnel to ShopSphere VPN...",
    "Authenticating via Sentra Protocol...",
    "Mounting Data Warehouse & Snowflake Instances...",
    "Loading internal communication logs...",
    "Environment Secured. Entering Workspace."
  ];

  useEffect(() => {
    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < messages.length) {
        setStage(currentStage);
      }
    }, 1200);

    const timeout = setTimeout(() => {
      router.push("/simulation/intro");
    }, 6500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-slate-300">
      <div className="max-w-md w-full px-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl p-2">
          <Image
            src="/image-removebg-preview (1).png"
            alt="HireSapien Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        
        <div className="h-32 flex flex-col items-center justify-center text-center">
          {stage < messages.length - 1 ? (
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mb-4" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          )}
          
          <div className="text-sm tracking-widest uppercase opacity-80 transition-all duration-500">
            {messages[stage]}
          </div>
        </div>
      </div>
    </div>
  );
}
