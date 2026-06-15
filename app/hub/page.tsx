"use client";

import React from "react";
import Link from "next/link";
import { Database, Lightbulb, TrendingUp, Clock, Target, ArrowRight } from "lucide-react";

export default function SimulationHub() {
  const simulations = [
    {
      id: "data-scientist",
      title: "Data Scientist Industry Simulation",
      role: "Junior Data Scientist",
      company: "ShopSphere",
      icon: Database,
      color: "blue",
      duration: "15-20 mins",
      missions: 8,
      status: "Available",
      href: "/simulation/intro"
    },
    {
      id: "product-manager",
      title: "Product Manager Strategy Simulation",
      role: "Associate Product Manager",
      company: "TechNova",
      icon: Lightbulb,
      color: "purple",
      duration: "20-25 mins",
      missions: 6,
      status: "Coming Soon",
      href: "#"
    },
    {
      id: "marketing-analyst",
      title: "Growth Marketing Simulation",
      role: "Growth Analyst",
      company: "Streamify",
      icon: TrendingUp,
      color: "green",
      duration: "15 mins",
      missions: 5,
      status: "Coming Soon",
      href: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end border-b border-gray-200 pb-6">
          <div>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold mb-4 shadow-sm">
              H
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Simulation Hub</h1>
            <p className="text-gray-500">Select a role and test your skills in real-world scenarios.</p>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2 animate-pulse"></span>
            System Online
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {simulations.map((sim) => {
            const isAvailable = sim.status === "Available";
            
            return (
              <div 
                key={sim.id} 
                className={`relative flex flex-col bg-white rounded-3xl border transition-all ${
                  isAvailable ? "border-gray-200 shadow-lg hover:-translate-y-1 hover:shadow-xl hover:border-blue-300" : "border-gray-100 shadow-sm opacity-70"
                }`}
              >
                {!isAvailable && (
                  <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">
                    Coming Soon
                  </div>
                )}
                
                <div className={`h-32 rounded-t-3xl bg-gradient-to-br p-6 flex items-end ${
                  sim.color === 'blue' ? 'from-blue-500 to-indigo-600' : 
                  sim.color === 'purple' ? 'from-purple-500 to-fuchsia-600' :
                  'from-emerald-500 to-teal-600'
                }`}>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30 text-white">
                    <sim.icon className="w-8 h-8" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{sim.company}</p>
                    <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-1">{sim.title}</h3>
                    <p className="text-gray-600 font-medium">Role: {sim.role}</p>
                  </div>

                  <div className="flex space-x-4 mb-8 mt-auto">
                    <div className="flex items-center text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                      {sim.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Target className="w-4 h-4 mr-1.5 text-gray-400" />
                      {sim.missions} Missions
                    </div>
                  </div>

                  {isAvailable ? (
                    <Link 
                      href={sim.href}
                      className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl flex items-center justify-center transition-colors shadow-md"
                    >
                      Enter Simulation <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  ) : (
                    <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-3.5 rounded-xl flex items-center justify-center cursor-not-allowed">
                      Locked
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
