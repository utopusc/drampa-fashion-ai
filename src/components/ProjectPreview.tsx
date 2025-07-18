"use client";

import React from 'react';
import { FolderOpen, User, ImageIcon, Move, Shirt } from 'lucide-react';

interface ProjectNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    model?: {
      id: string;
      name: string;
      image?: string;
    };
    styleItems?: Array<{
      type: 'background' | 'pose' | 'fashion';
      name: string;
    }>;
  };
}

interface ProjectPreviewProps {
  nodes?: ProjectNode[];
  className?: string;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ nodes = [], className = "" }) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${className}`}>
        <div className="text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Empty Project</p>
        </div>
      </div>
    );
  }

  // Calculate preview area bounds
  const bounds = nodes.reduce(
    (acc, node) => ({
      minX: Math.min(acc.minX, node.position.x),
      maxX: Math.max(acc.maxX, node.position.x + 200), // Assume node width ~200px
      minY: Math.min(acc.minY, node.position.y),
      maxY: Math.max(acc.maxY, node.position.y + 100), // Assume node height ~100px
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  );

  const width = bounds.maxX - bounds.minX || 400;
  const height = bounds.maxY - bounds.minY || 300;
  const scale = Math.min(200 / width, 120 / height, 1); // Scale to fit in ~200x120px area

  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden ${className}`}>
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Flow lines */}
      <div className="absolute inset-0">
        {nodes.length > 1 && (
          <svg className="w-full h-full opacity-20">
            {nodes.slice(0, -1).map((node, index) => {
              const nextNode = nodes[index + 1];
              if (!nextNode) return null;
              
              const x1 = ((node.position.x - bounds.minX) * 0.5 + 40) * scale;
              const y1 = ((node.position.y - bounds.minY) * 0.5 + 25) * scale;
              const x2 = ((nextNode.position.x - bounds.minX) * 0.5 + 40) * scale;
              const y2 = ((nextNode.position.y - bounds.minY) * 0.5 + 25) * scale;
              
              return (
                <line
                  key={index}
                  x1={x1 + 200}
                  y1={y1 + 60}
                  x2={x2 + 200}
                  y2={y2 + 60}
                  stroke="rgb(99, 102, 241)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        )}
      </div>
      
      {/* Nodes container */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div 
          className="relative"
          style={{
            transform: `scale(${Math.min(scale, 0.8)})`,
            transformOrigin: 'center'
          }}
        >
          {nodes.map((node, index) => {
            const relativeX = (node.position.x - bounds.minX) * 0.5;
            const relativeY = (node.position.y - bounds.minY) * 0.5;
            
            return (
              <div
                key={node.id}
                className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                style={{
                  left: relativeX,
                  top: relativeY,
                  width: '90px',
                  height: '60px',
                  animation: `nodeFloat 0.6s ease-out ${index * 0.15}s both, pulse 2s ease-in-out ${index * 0.3}s infinite`
                }}
              >
                {/* Node header with glow effect */}
                <div className="h-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center relative">
                  <User className="w-2.5 h-2.5 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-50 blur-sm"></div>
                </div>
                
                {/* Node content */}
                <div className="flex-1 p-1.5 flex flex-col items-center justify-center">
                  <div className="text-[7px] text-center text-gray-700 dark:text-gray-300 font-medium leading-tight mb-0.5">
                    {node.data.model?.name || 'Model'}
                  </div>
                  
                  {/* Mini avatar */}
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-60"></div>
                </div>
                
                {/* Style items indicators with better styling */}
                {node.data.styleItems && node.data.styleItems.length > 0 && (
                  <div className="absolute -bottom-1.5 -right-1.5 flex gap-0.5">
                    {node.data.styleItems.slice(0, 3).map((item, i) => {
                      const Icon = item.type === 'background' ? ImageIcon : 
                                  item.type === 'pose' ? Move : Shirt;
                      const bgColor = item.type === 'background' ? 'bg-emerald-500' :
                                     item.type === 'pose' ? 'bg-amber-500' : 'bg-rose-500';
                      return (
                        <div
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full ${bgColor} flex items-center justify-center shadow-md`}
                          style={{
                            animation: `bounce 1s ease-in-out ${i * 0.2 + 1}s infinite`
                          }}
                        >
                          <Icon className="w-1 h-1 text-white" />
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Connection points */}
                <div className="absolute -right-1 top-1/2 w-2 h-2 rounded-full bg-indigo-400 opacity-60 transform -translate-y-1/2"></div>
                {index > 0 && (
                  <div className="absolute -left-1 top-1/2 w-2 h-2 rounded-full bg-indigo-400 opacity-60 transform -translate-y-1/2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Stats overlay */}
      <div className="absolute bottom-2 right-2 bg-black/20 backdrop-blur-sm rounded px-2 py-1">
        <span className="text-xs text-white font-medium">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <style jsx>{`
        @keyframes nodeFloat {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          50% {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-2px);
          }
          60% {
            transform: translateY(-1px);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectPreview;