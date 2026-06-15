import React from "react";
import { Users, Target, Activity, FileCheck } from "lucide-react";

export default function SuperAdminDashboard() {
  // Static mock data for MVP UI
  const stats = [
    { label: "Total Candidates", value: "142", icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Avg Readiness Score", value: "68/100", icon: Target, color: "bg-green-100 text-green-600" },
    { label: "Completion Rate", value: "89%", icon: FileCheck, color: "bg-purple-100 text-purple-600" },
    { label: "Active Simulations", value: "12", icon: Activity, color: "bg-orange-100 text-orange-600" },
  ];

  const recentCandidates = [
    { name: "Sarah Johnson", email: "sarah.j@example.com", date: "Oct 24, 2026", score: 82, level: "Industry Ready" },
    { name: "Michael Chen", email: "mchen99@example.com", date: "Oct 24, 2026", score: 65, level: "Industry Ready Foundation" },
    { name: "Priya Patel", email: "priya.p@example.com", date: "Oct 23, 2026", score: 45, level: "Emerging Professional" },
    { name: "David Kim", email: "dkim@example.com", date: "Oct 23, 2026", score: 78, level: "Industry Ready Foundation" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Institution Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of all candidate simulation attempts</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{s.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Recent Candidates</h2>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="border border-gray-200 rounded-lg px-4 py-1.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Taken</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Readiness Level</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentCandidates.map((c, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.date}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-900">{c.score}</span><span className="text-gray-400 text-sm">/100</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    c.level.includes("Foundation") ? "bg-blue-100 text-blue-700" :
                    c.level.includes("Emerging") ? "bg-orange-100 text-orange-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {c.level}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 font-medium text-sm hover:underline">View Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
