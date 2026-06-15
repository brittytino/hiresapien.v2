"use client";

import React from "react";
import { Star, Lightbulb, FileSearch, LineChart, Brain, Briefcase, MessageSquare } from "lucide-react";

export function EvaluatedOnCard() {
  const competencies = [
    { name: "Problem Understanding", icon: FileSearch },
    { name: "Data Interpretation", icon: LineChart },
    { name: "Analytical Reasoning", icon: Brain },
    { name: "Business Thinking", icon: Briefcase },
    { name: "Communication", icon: MessageSquare },
  ];

  return (
    <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100/50 flex-1 flex flex-col justify-between">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">What You Will Be Evaluated On</h3>
      </div>
      
      <div className="flex items-center justify-between px-2">
        {competencies.map((comp, i) => (
          <div key={i} className="flex flex-col items-center text-center max-w-[80px]">
            <comp.icon className="w-5 h-5 text-gray-500 mb-2" strokeWidth={1.5} />
            <span className="text-xs font-medium text-gray-600 leading-tight">{comp.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TipsCard() {
  const tips = [
    "Think like a data scientist in a real workplace",
    "Use the data and context provided carefully",
    "Provide clear and concise responses"
  ];

  return (
    <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100/50 flex-1 ml-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Tips for Success</h3>
      </div>
      
      <ul className="space-y-2 ml-14">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start text-sm text-gray-700 font-medium">
            <span className="mr-2 text-purple-500">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
