"use client";

import React from "react";
import Sidebar from "@/components/simulation/Sidebar";
import ProctoringGuard from "@/components/simulation/ProctoringGuard";
import { usePathname } from "next/navigation";

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = pathname
    ? !pathname.startsWith("/simulation/transition") &&
      !pathname.startsWith("/simulation/mission")
    : true;

  return (
    <ProctoringGuard>
      <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-gray-900">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {pathname?.startsWith("/simulation/transition") || pathname?.startsWith("/simulation/intro") ? (
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          ) : (
            <main className="flex-1 overflow-y-auto p-8">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          )}
        </div>
      </div>
    </ProctoringGuard>
  );
}
