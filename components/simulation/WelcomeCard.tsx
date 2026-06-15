"use client";

import React from "react";
import { Clock, ListTodo } from "lucide-react";

export default function WelcomeCard() {
  return (
    <div className="bg-[#EBF5FF] rounded-2xl p-8 flex items-center justify-between shadow-sm border border-blue-100">
      <div className="flex items-center">
        <div className="mr-8">
          {/* We'll use a placeholder for the illustration, since we don't have the exact asset */}
          <div className="w-48 h-40 bg-blue-200/50 rounded-xl flex items-center justify-center relative overflow-hidden">
             <span className="text-blue-500 font-medium">Illustration</span>
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-transparent"></div>
          </div>
        </div>
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Welcome to Your First Day!</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            You are a <span className="font-semibold text-slate-900">Junior Data Scientist</span> at <span className="font-semibold text-slate-900">ShopSphere</span>, an e-commerce company.
            Your manager has assigned you a series of tasks to understand why customer purchases are dropping.
          </p>
          <div className="flex items-center space-x-8 text-sm font-medium text-slate-700">
            <div className="flex items-center bg-white/60 px-3 py-1.5 rounded-lg border border-white/80">
              <Clock className="w-4 h-4 mr-2 text-slate-500" />
              Estimated Time: 15-20 mins
            </div>
            <div className="flex items-center bg-white/60 px-3 py-1.5 rounded-lg border border-white/80">
              <ListTodo className="w-4 h-4 mr-2 text-slate-500" />
              Total Missions: 8
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
