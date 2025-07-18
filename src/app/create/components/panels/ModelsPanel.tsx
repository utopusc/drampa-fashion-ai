"use client";

import React, { useState } from 'react';
import { models, ModelData } from '@/data/models';
import Image from 'next/image';

export default function ModelsPanel() {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const filteredModels = models.filter(model => model.gender === selectedGender);

  const onDragStart = (event: React.DragEvent, model: ModelData) => {
    event.dataTransfer.setData('application/reactflow', 'modelNode');
    event.dataTransfer.setData('modelData', JSON.stringify({
      model: {
        id: model.id,
        name: model.name,
        image: model.photo,
        loraUrl: model.loraUrl,
      }
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Models</h2>
        
        {/* Gender Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedGender('female')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
              selectedGender === 'female' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Female
          </button>
          <button
            onClick={() => setSelectedGender('male')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
              selectedGender === 'male' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Male
          </button>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              draggable
              onDragStart={(e) => onDragStart(e, model)}
              className="cursor-move group"
            >
              <div className="relative overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                {/* Image with portrait aspect ratio */}
                <div className="aspect-[2/3] overflow-hidden">
                  <Image
                    src={model.photo}
                    alt={model.name}
                    width={200}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to placeholder
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <span class="text-3xl font-semibold text-primary">${model.name[0]}</span>
                        </div>
                      `;
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
              
              {/* Model name */}
              <p className="mt-2 text-center text-sm font-medium text-foreground">
                {model.name}
              </p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Drag a model to the canvas to start your design
          </p>
        </div>
      </div>
    </div>
  );
}