"use client";

import { useState } from "react";
import { User } from "lucide-react";

interface Child {
  id: string;
  name: string;
  surname: string;
  img?: string;
  class: { name: string } | null;
  grade: { level: number } | null;
  isPrimary: boolean;
}

interface ChildSelectorProps {
  children: Child[];
  selectedChild: Child | null;
  onSelectChild: (child: Child) => void;
}

export default function ChildSelector({ children, selectedChild, onSelectChild }: ChildSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Select Child</h2>
        <span className="text-xs text-gray-500">
          {children.length} {children.length === 1 ? "child" : "children"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => onSelectChild(child)}
            className={`p-3 rounded-xl border-2 transition-all ${
              selectedChild?.id === child.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {child.img ? (
                  <img
                    src={child.img}
                    alt={child.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  `${child.name[0]}${child.surname[0]}`
                )}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {child.name} {child.surname}
                </p>
                <p className="text-xs text-gray-500">
                  {child.grade ? `Grade ${child.grade.level}` : ""}{" "}
                  {child.class?.name && `· ${child.class.name}`}
                </p>
              </div>
              {child.isPrimary && (
                <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  Primary
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
