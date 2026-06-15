"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, Info, TrendingUp, BarChart2, FileText, Clock, Target } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Simulation Flow", icon: LayoutDashboard, href: "/simulation/intro", section: "Assessment" },
    { label: "Instructions", icon: Info, href: "/simulation/instructions", section: "Assessment" },
    { label: "My Progress", icon: TrendingUp, href: "/simulation/progress", section: "Assessment" },
    { label: "Results", icon: BarChart2, href: "/simulation/result", section: "Reports" },
    { label: "Feedback Report", icon: FileText, href: "/simulation/feedback", section: "Reports" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-4">
      <div className="mb-8 px-2 flex items-center space-x-2">
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          H
        </div>
        <h1 className="text-xl font-bold text-gray-900">Hiresapien</h1>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Assessment</h2>
          <div className="space-y-1">
            {navItems.filter(i => i.section === "Assessment").map((item) => (
              <Link key={item.label} href={item.href}>
                <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname.startsWith(item.href) ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                }`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="space-y-1">
            {navItems.filter(i => i.section === "Reports").map((item) => (
              <Link key={item.label} href={item.href}>
                <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                }`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

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
    </div>
  );
}
