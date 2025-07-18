'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface DragPreview {
  x: number;
  y: number;
  image?: string;
  name: string;
  type: string;
}

export default function CustomDragLayer() {
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      const draggable = target.closest('[draggable="true"]');
      
      if (draggable) {
        const img = draggable.querySelector('img');
        const name = draggable.querySelector('p')?.textContent || 'Item';
        
        setDragPreview({
          x: e.clientX,
          y: e.clientY,
          image: img?.src,
          name,
          type: 'background'
        });
      }
    };

    const handleDragMove = (e: DragEvent) => {
      if (dragPreview && e.clientX && e.clientY) {
        setDragPreview(prev => prev ? {
          ...prev,
          x: e.clientX,
          y: e.clientY
        } : null);
      }
    };

    const handleDragEnd = () => {
      setDragPreview(null);
    };

    document.addEventListener('dragstart', handleDragStart as any);
    document.addEventListener('dragover', handleDragMove as any);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('drop', handleDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleDragStart as any);
      document.removeEventListener('dragover', handleDragMove as any);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('drop', handleDragEnd);
    };
  }, [dragPreview]);

  if (!mounted || !dragPreview) return null;

  return createPortal(
    <AnimatePresence>
      {dragPreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            left: dragPreview.x - 75,
            top: dragPreview.y - 100,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className="w-[150px] h-[200px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-primary"
        >
          {dragPreview.image ? (
            <Image
              src={dragPreview.image}
              alt={dragPreview.name}
              width={150}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
              <span className="text-2xl font-bold text-primary">
                {dragPreview.name[0]}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <p className="text-white text-sm font-medium truncate">
              {dragPreview.name}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}