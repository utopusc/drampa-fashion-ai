"use client";

import React, { useState, useMemo } from 'react';
import { ModelData } from '@/data/models';
import { RadialOrbitingTimeline } from '@/components/ui/radial-orbital-timeline';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { formatCreditsAsDollars } from '@/lib/format';
import { fal } from "@/lib/fal";
import toast from 'react-hot-toast';

interface GenerationFlowProps {
  selectedModel: ModelData;
  userBalance: number;
  onGenerate: (cost: number) => void;
}

interface GenerationConfig {
  prompt: string;
  imageSize: string;
  numImages: number;
}

const IMAGE_SIZES = [
  { value: '512x512', label: '512x512', cost: 1 },
  { value: '768x768', label: '768x768', cost: 2 },
  { value: '1024x1024', label: '1024x1024', cost: 3 },
];

export default function GenerationFlow({ selectedModel, userBalance, onGenerate }: GenerationFlowProps) {
  const [config, setConfig] = useState<GenerationConfig>({
    prompt: '',
    imageSize: '1024x1024',
    numImages: 1,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate cost
  const cost = useMemo(() => {
    const sizeCost = IMAGE_SIZES.find(s => s.value === config.imageSize)?.cost || 3;
    return sizeCost * config.numImages * 100; // Convert to cents
  }, [config.imageSize, config.numImages]);

  const canGenerate = config.prompt.trim() && userBalance >= cost && !isGenerating;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    try {
      // Call Fal.ai API with the workflow
      const stream = await fal.stream("workflows/Drampa/flux", {
        input: {
          prompt: config.prompt,
          image_size: config.imageSize,
          loras: {
            [selectedModel.id]: selectedModel.loraUrl
          },
          num_images: config.numImages
        }
      });

      // Handle streaming events
      for await (const event of stream) {
        console.log('Generation event:', event);
        // You can update UI with progress here
      }

      const result = await stream.done();
      console.log('Generation complete:', result);
      
      // Deduct credits
      onGenerate(cost);
      
      toast.success('Images generated successfully!');
      
      // TODO: Navigate to results page with generated images
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Timeline items for the radial display
  const timelineItems = [
    {
      title: "Prompt",
      description: "Describe your fashion vision",
      content: (
        <div className="w-full">
          <textarea
            value={config.prompt}
            onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
            placeholder="E.g., Elegant evening dress with floral patterns..."
            className="w-full p-3 rounded-lg bg-background border border-border resize-none h-24 text-sm"
          />
        </div>
      ),
    },
    {
      title: "Image Size",
      description: "Choose resolution",
      content: (
        <div className="grid grid-cols-3 gap-2">
          {IMAGE_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => setConfig({ ...config, imageSize: size.value })}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                config.imageSize === size.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Quantity",
      description: "Number of images",
      content: (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setConfig({ ...config, numImages: Math.max(1, config.numImages - 1) })}
            className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 flex items-center justify-center"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{config.numImages}</span>
          <button
            onClick={() => setConfig({ ...config, numImages: Math.min(4, config.numImages + 1) })}
            className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 flex items-center justify-center"
          >
            +
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-2">Configure Your Design</h2>
        <p className="text-muted-foreground">Using model: {selectedModel.name}</p>
      </div>

      {/* Radial Timeline */}
      <div className="relative">
        <RadialOrbitingTimeline
          items={timelineItems}
          className="mx-auto"
        />

        {/* Center Content - Model Image & Generate Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center pointer-events-auto">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`relative w-32 h-32 rounded-full overflow-hidden transition-all transform ${
                canGenerate ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Model Avatar */}
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">
                  {selectedModel.name[0]}
                </span>
              </div>
              
              {/* Hover Overlay */}
              {canGenerate && (
                <div className="absolute inset-0 bg-primary/90 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <SparklesIcon className="w-8 h-8 mb-1" />
                  <span className="text-sm font-medium">Generate</span>
                </div>
              )}

              {/* Loading Spinner */}
              {isGenerating && (
                <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </button>

            {/* Cost Display */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Cost:</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCreditsAsDollars(cost)}
              </p>
              {cost > userBalance && (
                <p className="text-xs text-destructive mt-1">Insufficient balance</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}