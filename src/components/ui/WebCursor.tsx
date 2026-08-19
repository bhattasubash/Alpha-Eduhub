"use client";

import { useEffect, useState } from "react";

export default function WebCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if ("ontouchstart" in window) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div
        className="fixed pointer-events-none z-[9999] hidden md:block"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Small dot */}
        <div
          className={`w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-150 ${
            isClicking ? "scale-150" : "scale-100"
          }`}
        />

        {/* Web ring */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-red-500/50 rounded-full transition-all duration-200 ${
            isHovering ? "w-12 h-12 border-red-500/80" : "w-8 h-8"
          } ${isClicking ? "scale-75 border-red-500" : ""}`}
        >
          {/* Web strands */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1/2 bg-red-500/30 -rotate-45 origin-bottom" />
            <div className="w-1 h-1/2 bg-red-500/30 rotate-45 origin-bottom" />
            <div className="w-1 h-1/2 bg-blue-500/30 rotate-90 origin-bottom" />
            <div className="w-1 h-1/2 bg-blue-500/30 -rotate-90 origin-bottom" />
          </div>
        </div>

        {/* Outer glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-sm transition-all duration-200 ${
            isHovering ? "w-16 h-16" : "w-10 h-10"
          }`}
        />
      </div>

      {/* Hide default cursor */}
      <style jsx global>{`
        body {
          cursor: none;
        }
        @media (pointer: coarse) {
          body {
            cursor: auto;
          }
        }
      `}</style>
    </>
  );
}
