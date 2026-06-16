"use client";

import React, { useState } from "react";

export function SingleSelectUI({ options, onSelect }: { options: string[], onSelect: (val: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    setSelected(opt);
    onSelect(opt);
  };

  return (
    <div className="space-y-3">
      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => handleSelect(opt)}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
            selected === opt 
              ? "border-blue-600 bg-blue-50 shadow-sm" 
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
              selected === opt ? "border-blue-600" : "border-gray-300"
            }`}>
              {selected === opt && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
            </div>
            <span className={`font-medium ${selected === opt ? "text-blue-900" : "text-gray-700"}`}>{opt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MultiSelectUI({ options, onSelect }: { options: string[], onSelect: (val: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (opt: string) => {
    const newSelected = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    setSelected(newSelected);
    onSelect(newSelected);
  };

  return (
    <div className="space-y-3">
      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => toggleSelect(opt)}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
            selected.includes(opt) 
              ? "border-blue-600 bg-blue-50 shadow-sm" 
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
              selected.includes(opt) ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
            }`}>
              {selected.includes(opt) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`font-medium ${selected.includes(opt) ? "text-blue-900" : "text-gray-700"}`}>{opt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShortTextUI({ onUpdate }: { onUpdate: (val: string) => void }) {
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    onUpdate(val);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const isMinWords = wordCount >= 50;

  return (
    <div className="mt-2 space-y-2">
      <textarea
        value={text}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all resize-none min-h-[160px] text-gray-800"
        placeholder="Provide a detailed analysis (minimum 50 words)..."
        onChange={handleChange}
      />
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className={isMinWords ? "text-emerald-600" : "text-amber-600"}>
          {isMinWords ? "✓ Minimum length met" : "⚠️ Please write at least 50 words"}
        </span>
        <span className={`${isMinWords ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"} px-2.5 py-1 rounded-md transition-all`}>
          Word Count: {wordCount} / 50
        </span>
      </div>
    </div>
  );
}

export function SliderUI({ range, onUpdate }: { range: number[], onUpdate: (val: number) => void }) {
  const [val, setVal] = useState((range[0] + range[1]) / 2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVal(v);
    onUpdate(v);
  };

  const getPercentage = () => {
    return ((val - range[0]) / (range[1] - range[0])) * 100;
  };

  const percent = getPercentage();
  const isPercent = range[1] > 10;

  const getColor = (p: number) => {
    if (p <= 30) return "from-blue-400 to-blue-500";
    if (p <= 60) return "from-indigo-400 to-indigo-600";
    return "from-violet-500 to-purple-600";
  };

  const getDisplayVal = () => {
    if (isPercent) return `${val}%`;
    return `${val} / ${range[1]}`;
  };

  const getLabel = () => {
    if (isPercent) {
      if (val <= 20) return "Not Confident";
      if (val <= 55) return "Slightly Confident";
      if (val <= 80) return "Highly Confident";
      return "Extremely Confident";
    } else {
      if (val <= 1) return "Very Low";
      if (val <= 2) return "Low";
      if (val <= 3) return "Medium";
      if (val <= 4) return "High";
      return "Critical";
    }
  };

  return (
    <div className="py-6 px-2">
      {/* Score Display (matching Confidence screen) */}
      <div className="flex flex-col items-center mb-8">
        <div
          className={`w-24 h-24 rounded-full bg-gradient-to-br ${getColor(percent)} flex items-center justify-center shadow-lg shadow-indigo-100 mb-3 transition-all duration-300`}
        >
          <span className="text-3xl font-black text-white">{getDisplayVal()}</span>
        </div>
        <span className="text-base font-bold text-slate-700">{getLabel()}</span>
      </div>

      {/* Range Slider Track */}
      <div className="relative px-2">
        <input 
          type="range" 
          min={range[0]} 
          max={range[1]} 
          step={1}
          value={val}
          onChange={handleChange}
          className="confidence-slider"
          style={{
            background: `linear-gradient(90deg, #6366f1 ${percent}%, #e5e7eb ${percent}%)`,
          }}
        />
        <div className="flex justify-between text-xs font-semibold text-gray-400 mt-4">
          <span>{range[0]}{isPercent ? "%" : ""} {isPercent ? "— Low" : "— Very Low"}</span>
          <span>{range[1]}{isPercent ? "%" : ""} {isPercent ? "— High" : "— Critical"}</span>
        </div>
      </div>
    </div>
  );
}

export function DashboardTableUI({ data }: { data: { columns: string[], rows: string[][] } }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {data.columns.map((col, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
