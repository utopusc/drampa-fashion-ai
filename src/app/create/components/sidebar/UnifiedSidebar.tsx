'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ImageIcon, Move, Shirt, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ModelsPanel from '../panels/ModelsPanel';
import BackgroundsPanel from './BackgroundsPanel';
import PosePanel from './PosePanel';
import FashionPanel from './FashionPanel';

interface UnifiedSidebarProps {
  onDrop: (item: any, type: string) => void;
  selectedItems: { type: string; value: any }[];
  onRemoveItem: (index: number) => void;
}

const tabs = [
  { id: 'models', label: 'Models', icon: User },
  { id: 'backgrounds', label: 'Backgrounds', icon: ImageIcon },
  { id: 'pose', label: 'Pose', icon: Move },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
];

export default function UnifiedSidebar({ onDrop, selectedItems, onRemoveItem }: UnifiedSidebarProps) {
  const [activeTab, setActiveTab] = useState('models');

  return (
    <div className="w-80 bg-background border-l border-border flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all',
                'hover:bg-muted/50',
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-muted/30'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'models' && (
              <ModelsPanel />
            )}
            {activeTab === 'backgrounds' && (
              <BackgroundsPanel onDrop={onDrop} />
            )}
            {activeTab === 'pose' && (
              <PosePanel onDrop={onDrop} />
            )}
            {activeTab === 'fashion' && (
              <FashionPanel onDrop={onDrop} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selected Items Tags */}
      {selectedItems.length > 0 && (
        <div className="border-t border-border p-4">
          <h4 className="text-sm font-medium mb-2">Selected Items</h4>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                <span>{item.value}</span>
                <button
                  onClick={() => onRemoveItem(index)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}