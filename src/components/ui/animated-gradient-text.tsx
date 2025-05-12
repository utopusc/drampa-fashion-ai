"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  gradientColors?: string[];
  className?: string;
  duration?: number;
}

export const AnimatedGradientText = ({
  children,
  gradientColors = ["#FF7722", "#FF9966", "#E65100"],
  className,
  duration = 8,
}: AnimatedGradientTextProps) => {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = gradientRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update the gradient position based on mouse position
      element.style.setProperty("--x-percentage", `${(x / rect.width) * 100}%`);
      element.style.setProperty("--y-percentage", `${(y / rect.height) * 100}%`);
    };

    // Add event listener
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const colorString = gradientColors.join(", ");

  return (
    <div
      ref={gradientRef}
      className={cn("inline-block relative", className)}
      style={{
        "--x-percentage": "50%",
        "--y-percentage": "50%",
      } as React.CSSProperties}
    >
      <span
        className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br transition-all"
        style={{
          backgroundImage: `radial-gradient(circle at var(--x-percentage) var(--y-percentage), ${colorString})`,
          backgroundSize: "200% 200%",
          animationDuration: `${duration}s`,
        }}
      >
        {children}
      </span>
    </div>
  );
}; 