'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useDrag } from '../DragContext';

interface PosePanelProps {
  onDrop: (item: any, type: string) => void;
}

const poses = [
  { id: 'standing', name: 'Standing', tag: 'standing pose', icon: '🚶' },
  { id: 'sitting', name: 'Sitting', tag: 'sitting pose', icon: '🪑' },
  { id: 'walking', name: 'Walking', tag: 'walking pose', icon: '🚶‍♀️' },
  { id: 'leaning', name: 'Leaning', tag: 'leaning pose', icon: '🧍' },
  { id: 'crossed-arms', name: 'Crossed Arms', tag: 'crossed arms pose', icon: '🤝' },
  { id: 'hands-on-hips', name: 'Hands on Hips', tag: 'hands on hips pose', icon: '💃' },
  { id: 'looking-side', name: 'Looking Side', tag: 'looking to the side pose', icon: '👀' },
  { id: 'back-view', name: 'Back View', tag: 'back view pose', icon: '🔄' },
];

export default function PosePanel({ onDrop }: PosePanelProps) {
  const { setDraggedItem } = useDrag();
  
  const handleDragStart = (e: React.DragEvent, pose: any) => {
    e.dataTransfer.setData('poseData', JSON.stringify(pose));
    e.dataTransfer.effectAllowed = 'copy';
    setDraggedItem({
      type: 'pose',
      data: pose
    });
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="grid grid-cols-2 gap-3">
        {poses.map((pose) => (
          <motion.div
            key={pose.id}
            draggable
            onDragStart={(e) => handleDragStart(e as any, pose)}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-move"
          >
            <div className="bg-muted hover:bg-muted/80 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors">
              <span className="text-3xl">{pose.icon}</span>
              <p className="text-sm font-medium text-center">{pose.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}