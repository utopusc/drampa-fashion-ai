'use client';

import React, { useState, useEffect } from 'react';
import { NodeProps, useReactFlow } from '@xyflow/react';
import Image from 'next/image';
import { ChevronDown, X, Plus, Settings, ImageIcon, Copy, Sparkles, Loader2 } from 'lucide-react';
import CleanBaseNode from './CleanBaseNode';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDrag } from '../DragContext';
import * as Popover from '@radix-ui/react-popover';
import generationService, { GenerationResponse } from '@/services/generationService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ImageModal from '@/components/ImageModal';
import useProjectStore from '@/store/projectStore';

interface StyleItem {
  id: string;
  type: 'background' | 'pose' | 'fashion';
  tag: string;
  image?: string;
  name: string;
}

interface ModelNodeData {
  model: {
    id: string;
    name: string;
    image: string;
    loraUrl?: string;
  };
  prompt?: string;
  tags?: string[];
  imageSize?: string;
  customWidth?: number;
  customHeight?: number;
  numImages?: number;
  styleItems?: StyleItem[];
  fastFashionMode?: boolean;
  onDelete: () => void;
  onUpdate: (data: any) => void;
  addNodeWithData?: (nodeData: any) => void;
}

export default function CleanModelNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as ModelNodeData;
  const { draggedItem } = useDrag();
  const { addNodes, getNode } = useReactFlow();
  const { user, updateUserCredits } = useAuth();
  const { currentProject } = useProjectStore();
  
  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{url: string, width: number, height: number, generatedSize?: string, generatedDims?: {width: number, height: number}}>>([]);
  const [showImages, setShowImages] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  
  // Component states - all hooks must be before any conditional returns
  const [prompt, setPrompt] = useState(nodeData?.prompt || '');
  const [tags, setTags] = useState<string[]>(nodeData?.tags || []);
  const [styleItems, setStyleItems] = useState<StyleItem[]>(nodeData?.styleItems || []);
  const [imageSize, setImageSize] = useState(nodeData?.imageSize || 'square_hd');
  const [customWidth, setCustomWidth] = useState(nodeData?.customWidth || 1024);
  const [customHeight, setCustomHeight] = useState(nodeData?.customHeight || 1024);
  const [numImages, setNumImages] = useState(nodeData?.numImages || 1);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fastFashionMode, setFastFashionMode] = useState(nodeData?.fastFashionMode || false);
  
  // Check if dragging over with compatible item
  useEffect(() => {
    if (draggedItem && draggedItem.type !== 'model') {
      // We're dragging a compatible item
      console.log('Dragging item:', draggedItem);
    }
  }, [draggedItem]);
  
  // Add null checks for model data
  if (!nodeData || !nodeData.model) {
    return (
      <CleanBaseNode selected={selected} onDelete={nodeData?.onDelete} className="w-80">
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Invalid model data</p>
        </div>
      </CleanBaseNode>
    );
  }
  
  // Check if currently dragging a background or pose
  const isDraggingBackground = draggedItem && draggedItem.type === 'background';
  const isDraggingPose = draggedItem && draggedItem.type === 'pose';

  const imageSizes = [
    { 
      value: 'square', 
      label: 'Square 1:1', 
      width: 1024, 
      height: 1024,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      value: 'square_hd', 
      label: 'Square HD', 
      width: 1024, 
      height: 1024,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
          <text x="12" y="14" textAnchor="middle" fontSize="8" fill="currentColor">HD</text>
        </svg>
      )
    },
    { 
      value: 'portrait_4_3', 
      label: 'Portrait 3:4', 
      width: 768, 
      height: 1024,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="6" y="3" width="12" height="18" rx="2" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      value: 'portrait_16_9', 
      label: 'Portrait 9:16', 
      width: 576, 
      height: 1024,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="8" y="2" width="8" height="20" rx="2" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      value: 'landscape_4_3', 
      label: 'Landscape 4:3', 
      width: 1024, 
      height: 768,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      value: 'landscape_16_9', 
      label: 'Landscape 16:9', 
      width: 1024, 
      height: 576,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="2" y="8" width="20" height="8" rx="2" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      value: 'custom', 
      label: 'Custom', 
      width: customWidth, 
      height: customHeight,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" strokeDasharray="2 2"/>
        </svg>
      )
    },
  ];

  // Helper function to get current dimensions
  const getCurrentDimensions = () => {
    if (imageSize === 'custom') {
      return { width: customWidth, height: customHeight };
    }
    const selectedSize = imageSizes.find(s => s.value === imageSize);
    return selectedSize ? { width: selectedSize.width, height: selectedSize.height } : { width: 1024, height: 1024 };
  };

  const handleAddTag = (tag: string) => {
    // Removed tag functionality
  };

  const handleRemoveTag = (index: number) => {
    // Removed tag functionality
  };

  const handleAddStyleItem = (item: StyleItem) => {
    let newItems = [...styleItems];
    
    // If it's a background or pose, remove any existing ones first (only one allowed)
    if (item.type === 'background') {
      // Remove existing background
      const existingBackground = styleItems.find(si => si.type === 'background');
      newItems = newItems.filter(si => si.type !== 'background');
    } else if (item.type === 'pose') {
      // Remove existing pose
      const existingPose = styleItems.find(si => si.type === 'pose');
      newItems = newItems.filter(si => si.type !== 'pose');
    }
    
    // Add the new item
    newItems.push(item);
    setStyleItems(newItems);
    nodeData.onUpdate({ ...nodeData, prompt, imageSize, numImages, styleItems: newItems });
  };

  const handleRemoveStyleItem = (index: number) => {
    const newItems = styleItems.filter((_, i) => i !== index);
    setStyleItems(newItems);
    
    nodeData.onUpdate({ ...nodeData, prompt, imageSize, numImages, styleItems: newItems });
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    nodeData.onUpdate({ ...nodeData, prompt: value, imageSize, numImages, styleItems });
  };

  const handleImageSizeChange = (value: string) => {
    setImageSize(value);
    // If not custom, update dimensions from the selected size
    if (value !== 'custom') {
      const selectedSize = imageSizes.find(s => s.value === value);
      if (selectedSize) {
        setCustomWidth(selectedSize.width);
        setCustomHeight(selectedSize.height);
      }
    }
    nodeData.onUpdate({ ...nodeData, imageSize: value, prompt, numImages, styleItems, customWidth, customHeight });
  };

  const handleNumImagesChange = (value: number) => {
    setNumImages(value);
    nodeData.onUpdate({ ...nodeData, numImages: value, prompt, imageSize, styleItems });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    
    console.log('Drop event in CleanModelNode');
    
    // Use global drag context if available
    if (draggedItem && draggedItem.type !== 'model') {
      console.log('Using global dragged item:', draggedItem);
      
      if (draggedItem.type === 'background') {
        handleAddStyleItem({
          id: `bg-${Date.now()}`,
          type: 'background',
          tag: draggedItem.data.tag,
          image: draggedItem.data.image,
          name: draggedItem.data.name
        });
        return;
      }
    }
    
    // Fallback to dataTransfer
    console.log('DataTransfer types:', e.dataTransfer.types);
    
    const backgroundData = e.dataTransfer.getData('backgroundData');
    const poseData = e.dataTransfer.getData('poseData');
    const fashionData = e.dataTransfer.getData('fashionData');
    
    console.log('Received data:', { backgroundData, poseData, fashionData });
    
    try {
      if (backgroundData) {
        const bg = JSON.parse(backgroundData);
        console.log('Parsed background:', bg);
        handleAddStyleItem({
          id: `bg-${Date.now()}`,
          type: 'background',
          tag: bg.tag,
          image: bg.image,
          name: bg.name
        });
      } else if (poseData) {
        const pose = JSON.parse(poseData);
        handleAddStyleItem({
          id: `pose-${Date.now()}`,
          type: 'pose',
          tag: pose.tag,
          name: pose.name
        });
      } else if (fashionData) {
        const fashion = JSON.parse(fashionData);
        handleAddStyleItem({
          id: `fashion-${Date.now()}`,
          type: 'fashion',
          tag: fashion.tag,
          name: fashion.name
        });
      } else {
        console.log('No data found in drop event');
      }
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're leaving to a child element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDraggingOver(false);
    }
  };

  return (
    <>
    <CleanBaseNode
      selected={selected}
      onDelete={nodeData.onDelete}
      className="w-80"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      additionalControls={
        <>
          {/* Settings Button */}
          <Popover.Root open={showSettings} onOpenChange={setShowSettings}>
            <Popover.Trigger asChild>
              <button
                className={cn(
                  "absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full",
                  "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
                  "hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700",
                  "flex items-center justify-center transition-all duration-200",
                  "shadow-sm hover:shadow-md",
                  showSettings && "border-primary bg-gray-50 dark:bg-gray-700"
                )}
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="w-72 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
              sideOffset={10}
              side="left"
              align="center"
            >
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Generation Settings</h3>
                
                {/* Image Size */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Image Size
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({getCurrentDimensions().width}×{getCurrentDimensions().height})
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {imageSizes.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => handleImageSizeChange(size.value)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                          imageSize === size.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        )}
                        title={`${size.label} (${size.width}x${size.height})`}
                      >
                        {size.icon}
                        <span className="text-xs font-medium">{size.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Size Inputs */}
                  {imageSize === 'custom' && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Width</label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => {
                            const val = Math.min(2048, Math.max(256, parseInt(e.target.value) || 256));
                            setCustomWidth(val);
                            nodeData.onUpdate({ ...nodeData, imageSize: 'custom', customWidth: val, customHeight, prompt, numImages, styleItems });
                          }}
                          min="256"
                          max="2048"
                          step="64"
                          className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Height</label>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => {
                            const val = Math.min(2048, Math.max(256, parseInt(e.target.value) || 256));
                            setCustomHeight(val);
                            nodeData.onUpdate({ ...nodeData, imageSize: 'custom', customWidth, customHeight: val, prompt, numImages, styleItems });
                          }}
                          min="256"
                          max="2048"
                          step="64"
                          className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Fashion Recommended Sizes */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Fashion Recommended:</p>
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => {
                          setImageSize('custom');
                          setCustomWidth(1080);
                          setCustomHeight(1350);
                          nodeData.onUpdate({ ...nodeData, imageSize: 'custom', customWidth: 1080, customHeight: 1350, prompt, numImages, styleItems });
                        }}
                        className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        Instagram Post (1080×1350)
                      </button>
                      <button
                        onClick={() => {
                          setImageSize('custom');
                          setCustomWidth(1200);
                          setCustomHeight(1800);
                          nodeData.onUpdate({ ...nodeData, imageSize: 'custom', customWidth: 1200, customHeight: 1800, prompt, numImages, styleItems });
                        }}
                        className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        E-commerce (1200×1800)
                      </button>
                      <button
                        onClick={() => {
                          setImageSize('custom');
                          setCustomWidth(800);
                          setCustomHeight(1200);
                          nodeData.onUpdate({ ...nodeData, imageSize: 'custom', customWidth: 800, customHeight: 1200, prompt, numImages, styleItems });
                        }}
                        className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        Product Page (800×1200)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Number of Images */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Number of Images
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNumImagesChange(Math.max(1, numImages - 1))}
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900 dark:text-gray-100">
                      {numImages}
                    </span>
                    <button
                      onClick={() => handleNumImagesChange(Math.min(4, numImages + 1))}
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Fast Fashion Mode */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fast Fashion Mode
                      </label>
                    </div>
                    <button
                      onClick={() => {
                        setFastFashionMode(!fastFashionMode);
                        nodeData.onUpdate({ ...nodeData, fastFashionMode: !fastFashionMode });
                      }}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                        fastFashionMode ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
                          fastFashionMode ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Optimizes images for AI fashion editing with solid colors
                  </p>
                </div>
              </div>
              <Popover.Arrow className="fill-white dark:fill-gray-800" />
            </Popover.Content>
          </Popover.Portal>
          </Popover.Root>
          
          {/* Clone Button */}
          <button
            onClick={() => {
              const currentNode = getNode(id);
              if (currentNode && nodeData.addNodeWithData) {
                const newNodeId = `model-${Date.now()}`;
                const newNode = {
                  id: newNodeId,
                  type: 'modelNode',
                  position: {
                    x: currentNode.position.x + 400,
                    y: currentNode.position.y
                  },
                  data: {
                    model: nodeData.model,
                    prompt: prompt,
                    tags: [...tags],
                    imageSize: imageSize,
                    numImages: numImages,
                    styleItems: [...styleItems]
                  }
                };
                nodeData.addNodeWithData(newNode);
              }
            }}
            className={cn(
              "absolute -left-14 top-1/2 -translate-y-1/2 mt-14 w-10 h-10 rounded-full",
              "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
              "hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700",
              "flex items-center justify-center transition-all duration-200",
              "shadow-sm hover:shadow-md"
            )}
            title="Clone Node"
          >
            <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Generated Images Display */}
          <AnimatePresence>
            {showImages && generatedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute left-1/2 -translate-x-1/2"
                style={{ bottom: 'calc(100% + 20px)' }}
              >
                <div className="flex gap-4">
                  {generatedImages.map((image, index) => {
                    // Use the dimensions from when the image was generated
                    const dims = image.generatedDims || getCurrentDimensions();
                    const aspectRatio = dims.width / dims.height;
                    const boxWidth = aspectRatio > 1 ? 320 : 240; // Wider for landscape
                    const boxHeight = boxWidth / aspectRatio;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                        style={{ width: `${boxWidth}px`, height: `${boxHeight}px` }}
                      >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                          <Image
                            src={image.url}
                            alt={`Generated ${index + 1}`}
                            width={image.width || 1024}
                            height={image.height || 1024}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(`Failed to load image ${index + 1}:`, image.url);
                            }}
                            unoptimized={true}
                          />
                          
                          {/* Controls - positioned like node close button */}
                          <div className="absolute -top-2 -right-2 flex gap-1">
                            <button
                              onClick={() => setModalImage(image.url)}
                              className="w-6 h-6 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
                              title="Zoom"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </button>
                            {generatedImages.length > 1 && (
                              <button
                                onClick={() => {
                                  const newImages = generatedImages.filter((_, i) => i !== index);
                                  setGeneratedImages(newImages);
                                  if (newImages.length === 0) setShowImages(false);
                                }}
                                className="w-6 h-6 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
                                title="Remove"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Animated glow effect - only show briefly after generation */}
                        {index === 0 && (
                          <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl -z-10"
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 2, delay: 1 }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Close all button - only show when single image */}
                {generatedImages.length === 1 && (
                  <button
                    onClick={() => setShowImages(false)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
                    title="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Generate Button */}
          <button
            onClick={async () => {
              if (!user) {
                toast.error('Please sign in to generate images');
                return;
              }
              
              if (user.credits < numImages) {
                toast.error(`Insufficient credits. You have ${user.credits} credits, but need ${numImages}`);
                return;
              }
              
              if (!prompt.trim()) {
                toast.error('Please enter a prompt');
                return;
              }
              
              setIsGenerating(true);
              setShowImages(false);
              
              try {
                // Build the full prompt with style items
                let fullPrompt = prompt;
                
                // Add Fast Fashion enhancement FIRST (before other modifiers)
                if (fastFashionMode) {
                  const fastFashionPrompt = `wearing minimalist solid color clothing, single uniform color garments, plain fabric without patterns or logos, professional studio fashion photography, clean aesthetic, model pose, high-end editorial style, perfect for AI clothing replacement, smooth fabric texture, well-fitted silhouette, fashion e-commerce ready, ${prompt}`;
                  fullPrompt = fastFashionPrompt;
                }
                
                const backgroundItem = styleItems.find(item => item.type === 'background');
                const poseItem = styleItems.find(item => item.type === 'pose');
                const fashionItems = styleItems.filter(item => item.type === 'fashion');
                
                if (backgroundItem) {
                  fullPrompt += `, ${backgroundItem.tag}`;
                }
                if (poseItem) {
                  fullPrompt += `, ${poseItem.tag}`;
                }
                if (fashionItems.length > 0 && !fastFashionMode) {
                  fullPrompt += `, wearing ${fashionItems.map(item => item.tag).join(', ')}`;
                }
                
                console.log('Generating with:', {
                  prompt: fullPrompt,
                  imageSize,
                  numImages,
                  loraUrl: nodeData.model.loraUrl
                });
                
                const response = await generationService.generateImage({
                  prompt: fullPrompt,
                  imageSize,
                  numImages,
                  loraUrl: nodeData.model.loraUrl,
                  projectId: currentProject?._id,
                  modelData: {
                    id: nodeData.model.id,
                    name: nodeData.model.name,
                    loraUrl: nodeData.model.loraUrl
                  },
                  styleItems: styleItems,
                  ...(imageSize === 'custom' ? { customWidth, customHeight } : {})
                });
                
                if (response.success && response.images) {
                  console.log('Generated images received:', response.images);
                  // Store the current dimensions with each image
                  const currentDims = getCurrentDimensions();
                  const imagesWithDims = response.images.map((img: any) => ({
                    ...img,
                    generatedSize: imageSize,
                    generatedDims: currentDims
                  }));
                  setGeneratedImages(imagesWithDims);
                  setShowImages(true);
                  
                  // Update user credits in context
                  if (response.remainingCredits !== undefined) {
                    updateUserCredits(response.remainingCredits);
                  }
                  
                  toast.success(`Generated ${response.images.length} image(s). ${response.remainingCredits} credits remaining.`);
                } else {
                  toast.error(response.message || 'Failed to generate images');
                }
              } catch (error: any) {
                console.error('Generation error:', error);
                toast.error(error.message || 'Failed to generate images');
              } finally {
                setIsGenerating(false);
              }
            }}
            disabled={isGenerating}
            className={cn(
              "absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
              isGenerating 
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" 
                : "bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100",
              "text-white dark:text-black shadow-lg hover:shadow-xl transform",
              !isGenerating && "hover:scale-110",
              "flex items-center justify-center transition-all duration-200",
              "border-2 border-gray-200 dark:border-gray-800"
            )}
            title={isGenerating ? "Generating..." : "Generate Images"}
          >
            {isGenerating ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </button>
          
          {/* Background and Pose Container */}
          <div className="absolute left-0 right-0 flex justify-between px-2" style={{ top: 'calc(100% + 20px)' }}>
            {/* Background Attachment */}
            {styleItems.filter(item => item.type === 'background').map((item) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 20 }}
                className="w-36 h-52 rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group"
              >
              <div className="relative w-full h-full">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={() => handleRemoveStyleItem(styleItems.indexOf(item))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <p className="text-sm text-white font-medium truncate">{item.name}</p>
                  <p className="text-xs text-white/70">Background</p>
                </div>
              </div>
            </motion.div>
            ))}
            
            {/* Empty space if no background */}
            {!styleItems.some(item => item.type === 'background') && <div className="w-36" />}
            
            {/* Pose Attachment */}
            {styleItems.filter(item => item.type === 'pose').map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 20 }}
                className="w-36 h-52 rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group"
              >
                <div className="relative w-full h-full">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10">
                    <span className="text-6xl">🚶</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => handleRemoveStyleItem(styleItems.findIndex(si => si.id === item.id))}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <p className="text-sm text-white font-medium truncate">{item.name}</p>
                    <p className="text-xs text-white/70">Pose</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Empty space if no pose */}
            {!styleItems.some(item => item.type === 'pose') && <div className="w-36" />}
          </div>
        </>
      }
    >
      <div className="p-6">
        {/* Show drag overlay when dragging backgrounds */}
        <AnimatePresence>
          {((isDraggingBackground && !styleItems.some(item => item.type === 'background')) ||
            (isDraggingPose && !styleItems.some(item => item.type === 'pose'))) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-primary/10 backdrop-blur-sm rounded-2xl flex items-center justify-center pointer-events-none"
            >
              <div className="text-center space-y-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center"
                >
                  {isDraggingBackground ? (
                    <ImageIcon className="w-8 h-8 text-primary" />
                  ) : isDraggingPose ? (
                    <span className="text-3xl">🚶</span>
                  ) : null}
                </motion.div>
                <p className="text-sm font-medium text-primary">
                  {isDraggingBackground ? 'Drop background here' : isDraggingPose ? 'Drop pose here' : ''}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Model Header */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            {nodeData.model.image ? (
              <Image
                src={nodeData.model.image}
                alt={nodeData.model.name || 'Model'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {nodeData.model.name || 'Unknown Model'}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
              {fastFashionMode && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Fast Fashion</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <ChevronDown 
              className={cn(
                "w-4 h-4 transition-transform",
                isExpanded ? "rotate-180" : ""
              )}
            />
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 overflow-hidden"
            >
              {/* Prompt Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  placeholder="Describe the outfit or style..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all nodrag"
                  rows={3}
                />
              </div>

              {/* Fashion Items Section */}
              {styleItems.filter(item => item.type === 'fashion').length > 0 && (
                <div className="px-4 pb-4">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Fashion Items</p>
                  <div className="grid grid-cols-4 gap-2">
                    {styleItems.filter(item => item.type === 'fashion').map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="relative group"
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="60px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-sm">👔</span>
                            </div>
                          )}
                          <button
                            onClick={() => handleRemoveStyleItem(styleItems.findIndex(si => si.id === item.id))}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 truncate">
                          {item.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CleanBaseNode>
    
    {/* Image Modal */}
    <ImageModal
      isOpen={modalImage !== null}
      onClose={() => setModalImage(null)}
      imageUrl={modalImage || ''}
      imageAlt="Generated fashion image"
    />
    </>
  );
}