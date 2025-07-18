'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FashionPanelProps {
  onDrop: (item: any, type: string) => void;
}

export default function FashionPanel({ onDrop }: FashionPanelProps) {
  const [hasFluxPhoto, setHasFluxPhoto] = useState(false);

  const fashionItems = [
    { id: 'casual', name: 'Casual Wear', tag: 'casual fashion style' },
    { id: 'formal', name: 'Formal Wear', tag: 'formal fashion style' },
    { id: 'streetwear', name: 'Streetwear', tag: 'streetwear fashion style' },
    { id: 'business', name: 'Business Attire', tag: 'business fashion style' },
    { id: 'evening', name: 'Evening Dress', tag: 'evening fashion style' },
    { id: 'sportswear', name: 'Sportswear', tag: 'sportswear fashion style' },
  ];

  const handleDragStart = (e: React.DragEvent, item: any) => {
    if (!hasFluxPhoto) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('fashionData', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      {!hasFluxPhoto && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Flux Photo Required
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Please generate a face photo with Flux AI first before applying fashion styles.
              </p>
              <button className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                Upload Flux Photo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={cn('grid grid-cols-2 gap-3', !hasFluxPhoto && 'opacity-50 pointer-events-none')}>
        {fashionItems.map((item) => (
          <motion.div
            key={item.id}
            draggable={hasFluxPhoto}
            onDragStart={(e) => handleDragStart(e as any, item)}
            whileHover={hasFluxPhoto ? { scale: 1.02 } : {}}
            whileTap={hasFluxPhoto ? { scale: 0.98 } : {}}
            className={cn(
              'bg-muted rounded-lg p-4 flex items-center justify-center text-center',
              hasFluxPhoto && 'cursor-move hover:bg-muted/80',
              !hasFluxPhoto && 'cursor-not-allowed'
            )}
          >
            <p className="text-sm font-medium">{item.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}