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
  return (
    <div className="mt-2">
      <textarea
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-0 outline-none transition-all resize-none min-h-[150px] text-gray-800"
        placeholder="Type your answer here..."
        onChange={(e) => onUpdate(e.target.value)}
      />
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

  return (
    <div className="py-8 px-4">
      <input 
        type="range" 
        min={range[0]} 
        max={range[1]} 
        value={val}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-sm font-semibold text-gray-500 mt-4">
        <span>{range[0]}%</span>
        <span className="text-xl text-blue-600">{val}%</span>
        <span>{range[1]}%</span>
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
