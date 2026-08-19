"use client";

// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Stars, Float } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
// import * as THREE from "three";

export default function CityScene() {
  // Return a simple fallback since 3D packages were removed
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMiIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+')] opacity-30"></div>
    </div>
  );
}