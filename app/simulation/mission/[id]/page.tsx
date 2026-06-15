"use client";

import React, { useState, useEffect } from "react";
import simulationData from "@/lib/simulation-data.json";
import { 
  SingleSelectUI, 
  MultiSelectUI, 
  ShortTextUI, 
  SliderUI, 
  DashboardTableUI 
} from "@/components/simulation/InteractionComponents";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";

export default function MissionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answer, setAnswer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mission = simulationData.assessment.missions.find(m => m.id === params.id);

  if (!mission) {
    return <div className="p-12 text-center font-bold text-xl">Mission not found</div>;
  }

  const task: any = mission.tasks[currentTaskIndex];

  // Reset answer when task changes
  useEffect(() => {
    setAnswer(null);
  }, [currentTaskIndex, params.id]);

  const handleSubmit = async () => {
    if (!answer && answer !== 0 && answer !== "") return;
    
    setLoading(true);
    setError("");

    try {
      const attemptId = localStorage.getItem("simulationAttemptId");
      if (!attemptId) {
        throw new Error("No active simulation attempt found. Please return to the hub.");
      }

      const res = await fetch("/api/simulation/submit-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          missionId: mission.id,
          taskId: task.id,
          answer
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit answer");
      }

      if (data.isComplete) {
        router.push("/simulation/result");
      } else if (data.nextMission) {
        router.push(`/simulation/mission/${data.nextMission.id}`);
      } else {
        setCurrentTaskIndex(prev => prev + 1);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      
      {/* Mission Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{mission.title}</h1>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mt-6">
          <p className="text-gray-800 font-medium whitespace-pre-line">{mission.context}</p>
        </div>
      </div>

      {/* Dashboard Data if any */}
      {mission.dashboardData && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Provided Data Dashboard</h2>
          <DashboardTableUI data={mission.dashboardData} />
        </div>
      )}

      {/* Current Task */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
           <h3 className="text-xl font-bold text-gray-900">Task {currentTaskIndex + 1} of {mission.tasks.length}</h3>
           <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
             {task.type}
           </span>
        </div>
        
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 leading-relaxed">{task.question}</h4>
        </div>
        
        {task.type === "SingleSelect" && task.options && (
          <SingleSelectUI options={task.options} onSelect={(val) => setAnswer(val)} />
        )}
        
        {task.type === "MultiSelect" && task.options && (
          <MultiSelectUI options={task.options} onSelect={(val) => setAnswer(val)} />
        )}

        {task.type === "ShortText" && (
          <ShortTextUI onUpdate={(val) => setAnswer(val)} />
        )}

        {task.type === "Slider" && task.range && (
          <SliderUI range={task.range} onUpdate={(val) => setAnswer(val)} />
        )}
        
        {task.type === "Ranking" && task.items && (
          <div className="p-4 bg-orange-50 text-orange-800 rounded-lg border border-orange-200">
            [Drag and Drop Ranking UI Placeholder: {task.items.join(", ")}]
            <div className="mt-4">
              <p className="text-sm font-bold mb-2">Simulate Answer (MVP):</p>
              <button 
                onClick={() => setAnswer(task.items)} 
                className="bg-orange-200 text-orange-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-300 transition-colors"
              >
                Mock Submit Default Order
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-400">
            {answer ? "Answer captured" : "Waiting for input..."}
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading || (!answer && answer !== 0 && answer !== "")}
            className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-xl flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Submit & Next <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
