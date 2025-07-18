"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface TimelineItem {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface RadialOrbitingTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function RadialOrbitingTimeline({ items, className }: RadialOrbitingTimelineProps) {
  const radius = 200;
  const angleStep = 360 / items.length;

  return (
    <div className={cn("relative w-[600px] h-[600px] mx-auto", className)}>
      {/* Orbit Circle */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/20" />
      
      {/* Center will be provided by parent */}
      
      {/* Timeline Items */}
      {items.map((item, index) => {
        const angle = (index * angleStep - 90) * (Math.PI / 180); // Start from top
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
          >
            <div className="bg-card border border-border rounded-xl p-4 shadow-lg w-48 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {item.description}
              </p>
              <div className="space-y-2">
                {item.content}
              </div>
            </div>
            
            {/* Connection Line */}
            <svg
              className="absolute w-full h-full pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <line
                x1="0"
                y1="0"
                x2={-x * 0.6}
                y2={-y * 0.6}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="text-muted-foreground/30"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}