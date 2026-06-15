"use client";

import React from "react";
import { Check, Search, Database, Brain, FileText, BarChart2, MessageSquare } from "lucide-react";

type MissionStatus = "COMPLETED" | "IN_PROGRESS" | "UPCOMING";

interface MissionProps {
  number: number;
  title: string;
  subtitle: string;
  status: MissionStatus;
  time: string;
  icon: React.ElementType;
}

export default function MissionStepper({ currentMissionId }: { currentMissionId?: string }) {
  // Mock data for MVP based on PRD
  const missions: MissionProps[] = [
    { number: 1, title: "Mission 1", subtitle: "The Slack Message", status: "COMPLETED", time: "~2 mins", icon: MessageSquare },
    { number: 2, title: "Mission 2", subtitle: "Dashboard Review", status: "COMPLETED", time: "~3 mins", icon: BarChart2 },
    { number: 3, title: "Mission 3", subtitle: "Investigate Further", status: "IN_PROGRESS", time: "~3 mins", icon: Search },
    { number: 4, title: "Mission 4", subtitle: "Stakeholder Conflict", status: "UPCOMING", time: "~2 mins", icon: MessageSquare },
    { number: 5, title: "Mission 5", subtitle: "Delivery Investigation", status: "UPCOMING", time: "~2 mins", icon: Search },
    { number: 6, title: "Mission 6", subtitle: "Customer Voice", status: "UPCOMING", time: "~2 mins", icon: FileText },
    { number: 7, title: "Mission 7", subtitle: "Data Quality Check", status: "UPCOMING", time: "~2 mins", icon: Database },
    { number: 8, title: "Mission 8", subtitle: "Executive Decision", status: "UPCOMING", time: "~3 mins", icon: Brain },
  ];

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Simulation Flow</h3>
          <p className="text-sm text-gray-500 mt-1">Complete all missions in sequence to finish the simulation.</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end space-x-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-900">33% (2/6)</span>
          </div>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: "33%" }}></div>
          </div>
        </div>
      </div>

      <div className="relative flex justify-between">
        {/* Horizontal Line Background */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
        
        {missions.map((mission, index) => {
          const isCompleted = mission.status === "COMPLETED";
          const isInProgress = mission.status === "IN_PROGRESS";
          const isUpcoming = mission.status === "UPCOMING";

          return (
            <div key={index} className="flex flex-col items-center group cursor-pointer relative bg-[#F8FAFC]">
              
              {/* Connector line overlay for completed path */}
              {index !== 0 && isCompleted && (
                 <div className="absolute top-1/2 right-1/2 w-full h-0.5 bg-green-500 -z-10 -translate-y-1/2" />
              )}
              {index !== 0 && isInProgress && (
                 <div className="absolute top-1/2 right-1/2 w-full h-0.5 bg-blue-500 -z-10 -translate-y-1/2" />
              )}

              {/* Status Indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all shadow-sm z-10 ${
                isCompleted ? "bg-green-500 border-green-500 text-white" :
                isInProgress ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100" :
                "bg-white border-gray-300 text-gray-400"
              }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : mission.number}
              </div>

              {/* Mission Card container for spacing */}
              <div className="mt-4 w-36 relative">
                 <div className={`absolute -top-[52px] left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-2 border-dashed opacity-0 pointer-events-none ${isInProgress ? 'border-blue-400 animate-spin-slow opacity-100' : ''}`}></div>
                 
                 <div className={`bg-white rounded-xl p-4 border transition-all text-center h-full flex flex-col items-center shadow-sm ${
                   isInProgress ? "border-blue-400 shadow-md transform -translate-y-1" :
                   isCompleted ? "border-gray-200" :
                   "border-gray-100 opacity-70"
                 }`}>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                     isCompleted ? "bg-green-50 text-green-500" :
                     isInProgress ? "bg-blue-50 text-blue-500" :
                     "bg-gray-50 text-gray-400"
                   }`}>
                     <mission.icon className="w-6 h-6" />
                   </div>
                   <h4 className={`text-sm font-bold mb-1 leading-tight ${isUpcoming ? 'text-gray-400' : 'text-gray-900'}`}>{mission.title}</h4>
                   <p className={`text-xs mb-3 font-medium ${isUpcoming ? 'text-gray-400' : 'text-gray-600'}`}>{mission.subtitle}</p>
                   
                   <div className="mt-auto flex items-center justify-center space-x-1">
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                       isCompleted ? "bg-green-100 text-green-700" :
                       isInProgress ? "bg-blue-100 text-blue-700" :
                       "bg-gray-100 text-gray-500"
                     }`}>
                       {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Upcoming"}
                     </span>
                     <span className="text-[10px] text-gray-400 ml-1">{mission.time}</span>
                   </div>
                 </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
