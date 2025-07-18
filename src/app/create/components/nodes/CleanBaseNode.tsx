'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CleanBaseNodeProps {
  selected: boolean;
  children: ReactNode;
  onDelete?: () => void;
  className?: string;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  additionalControls?: ReactNode;
}

export default function CleanBaseNode({
  selected,
  children,
  onDelete,
  className,
  onDrop,
  onDragOver,
  onDragLeave,
  additionalControls,
}: CleanBaseNodeProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 transition-all duration-200',
        selected 
          ? 'border-primary shadow-xl shadow-primary/20' 
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700',
        className
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      
      {/* Additional controls */}
      {additionalControls}

      {/* Content */}
      <div className="overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}