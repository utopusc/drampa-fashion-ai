"use client";

import React, { useState, useMemo } from 'react';
import { usePipelineStore } from '@/store/pipelineStore';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { formatCreditsAsDollars } from '@/lib/format';
import { fal } from "@/lib/fal";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface GenerateButtonProps {
  userBalance: number;
  onGenerate: (cost: number) => void;
}

const SIZE_COSTS = {
  'square_hd': 200,      // $2.00
  'portrait_4_3': 250,   // $2.50
  'portrait_16_9': 250,  // $2.50
  'landscape_4_3': 250,  // $2.50
  'landscape_16_9': 250, // $2.50
};

export default function GenerateButton({ userBalance, onGenerate }: GenerateButtonProps) {
  const router = useRouter();
  const { nodes, validatePipeline } = usePipelineStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Find model node
  const modelNode = nodes.find(node => node.type === 'modelNode');
  
  // Calculate cost - using default values for now since generation settings aren't in the new model node yet
  const cost = useMemo(() => {
    if (!modelNode) return 0;
    
    // Default to square_hd and 1 image for now
    const imageSize = modelNode.data.imageSize || 'square_hd';
    const numImages = modelNode.data.numImages || 1;
    const sizeCost = SIZE_COSTS[imageSize as keyof typeof SIZE_COSTS] || 200;
    return sizeCost * numImages;
  }, [modelNode]);

  // Check if we have the minimum required data
  const hasRequiredData = modelNode && 
                         modelNode.data.model && 
                         modelNode.data.prompt?.trim();

  const canGenerate = hasRequiredData && 
                     userBalance >= cost && 
                     !isGenerating;

  const handleGenerate = async () => {
    if (!canGenerate || !modelNode) return;

    setIsGenerating(true);
    try {
      // Build prompt with tags
      let fullPrompt = modelNode.data.prompt || '';
      if (modelNode.data.tags && modelNode.data.tags.length > 0) {
        fullPrompt = `${fullPrompt}, ${modelNode.data.tags.join(', ')}`;
      }

      // Get generation settings (with defaults)
      const imageSize = modelNode.data.imageSize || 'square_hd';
      const numImages = modelNode.data.numImages || 1;
      
      // Call Fal.ai API
      const stream = await fal.stream("workflows/Drampa/flux", {
        input: {
          prompt: fullPrompt,
          image_size: imageSize,
          loras: {
            [modelNode.data.model.id]: modelNode.data.model.loraUrl || ''
          },
          num_images: numImages
        }
      });

      // Handle streaming events
      for await (const event of stream) {
        console.log('Generation event:', event);
        if (event.type === 'progress') {
          toast.loading(`Generating... ${Math.round(event.progress * 100)}%`, {
            id: 'generation-progress'
          });
        }
      }

      const result = await stream.done();
      console.log('Generation complete:', result);
      
      // Dismiss loading toast
      toast.dismiss('generation-progress');
      
      // Deduct credits
      onGenerate(cost);
      
      toast.success('Images generated successfully!');
      
      // Navigate to results with generated images
      router.push('/create/results?images=' + encodeURIComponent(JSON.stringify(result)));
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.dismiss('generation-progress');
      toast.error('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!modelNode) {
    return (
      <div className="px-4 py-2 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">Add a model to start</p>
      </div>
    );
  }

  if (!modelNode.data.prompt?.trim()) {
    return (
      <div className="px-4 py-2 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">Enter a prompt to generate</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Cost</p>
        <p className="text-sm font-semibold text-foreground">
          {formatCreditsAsDollars(cost)}
        </p>
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
          canGenerate 
            ? 'hover:bg-primary/90 shadow-sm hover:shadow-md cursor-pointer' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <SparklesIcon className="w-4 h-4" />
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>

      {cost > userBalance && (
        <p className="text-xs text-destructive">Insufficient balance</p>
      )}
    </div>
  );
}