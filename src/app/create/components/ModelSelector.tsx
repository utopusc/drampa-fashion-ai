"use client";

import React, { useState } from 'react';
import { models, ModelData } from '@/data/models';
import { MagicCard } from '@/components/magicui/magic-card';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface ModelSelectorProps {
  onSelectModel: (model: ModelData) => void;
  selectedModel?: ModelData;
}

export default function ModelSelector({ onSelectModel, selectedModel }: ModelSelectorProps) {
  const [gender, setGender] = useState<'male' | 'female'>('female');
  
  const filteredModels = models.filter(model => model.gender === gender);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Model</h2>
        <p className="text-muted-foreground">Select a virtual model for your fashion design</p>
      </div>

      {/* Gender Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-muted rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setGender('female')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              gender === 'female' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Female
          </button>
          <button
            onClick={() => setGender('male')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              gender === 'male' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Male
          </button>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredModels.map((model) => (
          <MagicCard
            key={model.id}
            className={`cursor-pointer relative ${
              selectedModel?.id === model.id ? 'ring-2 ring-primary' : ''
            }`}
            gradientColor="#10b981"
            gradientOpacity={0.1}
          >
            <button
              onClick={() => onSelectModel(model)}
              className="w-full p-4 text-center"
            >
              {selectedModel?.id === model.id && (
                <div className="absolute top-2 right-2 z-10">
                  <CheckCircleIcon className="w-6 h-6 text-primary" />
                </div>
              )}
              
              <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-muted">
                <div className="w-full h-full bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/10" />
                {/* Placeholder for model image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-muted-foreground">
                    {model.name[0]}
                  </span>
                </div>
              </div>
              
              <h3 className="font-semibold text-foreground">{model.name}</h3>
              {model.description && (
                <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
              )}
            </button>
          </MagicCard>
        ))}
      </div>
    </div>
  );
}