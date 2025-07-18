'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useDrag } from '../DragContext';

interface BackgroundsPanelProps {
  onDrop: (item: any, type: string) => void;
}

const backgrounds = [
  { 
    id: 'beach', 
    name: 'Beach', 
    image: '/assets/Background/beach.jpg', 
    tag: 'beach background'
  },
  { 
    id: 'nature', 
    name: 'Nature', 
    image: '/assets/Background/nature.jpg', 
    tag: 'nature background'
  },
  { 
    id: 'city', 
    name: 'Big City', 
    image: '/assets/Background/BigCity.webp', 
    tag: 'urban city background'
  },
  { 
    id: 'home', 
    name: 'Home', 
    image: '/assets/Background/home.webp', 
    tag: 'home interior background'
  },
  { 
    id: 'outside', 
    name: 'Outside', 
    image: '/assets/Background/outside.webp', 
    tag: 'outdoor background'
  },
  { 
    id: 'valentine', 
    name: 'Valentine', 
    image: '/assets/Background/valantineDays.jpg', 
    tag: 'valentine romantic background'
  },
  { 
    id: 'white', 
    name: 'White Studio', 
    image: '/assets/Background/white.webp', 
    tag: 'white studio background'
  },
  { 
    id: 'luxury', 
    name: 'Luxury', 
    image: '/assets/Background/scarlet-luxe-mX8s-w.webp', 
    tag: 'luxury background'
  },
];

export default function BackgroundsPanel({ onDrop }: BackgroundsPanelProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<any>(null);
  const { setDraggedItem: setGlobalDraggedItem } = useDrag();

  const handleDragStart = (e: React.DragEvent, background: any) => {
    console.log('Starting drag for background:', background);
    
    // Set both local and global drag state
    setDraggedItem(background.id);
    setGlobalDraggedItem({
      type: 'background',
      data: background
    });
    
    // Set the data for the drag event - try multiple formats
    e.dataTransfer.setData('backgroundData', JSON.stringify(background));
    e.dataTransfer.setData('text/plain', JSON.stringify(background));
    e.dataTransfer.setData('application/json', JSON.stringify(background));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Don't set custom drag image for now to ensure compatibility
  };

  const handleDragEnd = () => {
    console.log('Drag ended');
    setDraggedItem(null);
    setGlobalDraggedItem(null);
  };
  
  const handleClick = (background: any) => {
    console.log('Background clicked:', background);
    setSelectedBackground(background);
    // Call onDrop directly as a fallback
    onDrop(background, 'background');
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-foreground mb-6">Backgrounds</h2>
      
      {/* Backgrounds Grid - Same style as Models */}
      <div className="grid grid-cols-2 gap-3">
        {backgrounds.map((bg) => (
          <div
            key={bg.id}
            draggable
            onDragStart={(e) => handleDragStart(e, bg)}
            onDragEnd={handleDragEnd}
            onClick={() => handleClick(bg)}
            className={`cursor-move group ${draggedItem === bg.id ? 'opacity-50' : ''} ${selectedBackground?.id === bg.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
          >
            <div className="relative overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
              {/* Image with portrait aspect ratio to match Models panel */}
              <div className="aspect-[2/3] overflow-hidden">
                <Image
                  src={bg.image}
                  alt={bg.name}
                  width={200}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  draggable={false}
                  onError={(e) => {
                    // Fallback to placeholder
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <span class="text-3xl font-semibold text-primary">${bg.name[0]}</span>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
              
              {/* Overlay gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Drag indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Background name */}
            <p className="mt-2 text-sm font-medium text-foreground text-center">{bg.name}</p>
          </div>
        ))}
      </div>
      
      {/* Instruction text */}
      <p className="mt-6 text-xs text-muted-foreground text-center">
        Drag a background to the canvas to apply it
      </p>
    </div>
  );
}