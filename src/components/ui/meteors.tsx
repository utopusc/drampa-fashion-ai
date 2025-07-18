"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors = ({
  number = 20,
  className,
}: MeteorsProps) => {
  const meteors = React.useMemo(() => {
    return Array.from({ length: number }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 4) + 1,
      top: Math.floor(Math.random() * 100),
      left: Math.floor(Math.random() * 100),
      duration: Math.floor(Math.random() * 5) + 5,
      delay: Math.random() * 5,
    }));
  }, [number]);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className={cn(
            "animate-meteor absolute rounded-full bg-gradient-to-r from-[#FF7722] to-[#FF9966] opacity-80 top-1/4 left-1/3"
          )}
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            width: `${meteor.size}px`,
            height: `${meteor.size * 35}px`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
          }}
        ></span>
      ))}
    </div>
  );
}; 