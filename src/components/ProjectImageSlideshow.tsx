"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ProjectImageSlideshowProps {
  nodes: any[];
  className?: string;
}

export default function ProjectImageSlideshow({ nodes, className = "" }: ProjectImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    // Extract all generated images from nodes
    const images: string[] = [];
    
    nodes.forEach(node => {
      if (node.data?.generatedImages && Array.isArray(node.data.generatedImages)) {
        node.data.generatedImages.forEach((img: any) => {
          if (img.url) {
            images.push(img.url);
          }
        });
      }
    });
    
    setAllImages(images);
  }, [nodes]);

  useEffect(() => {
    // Auto slide
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 3000); // Change slide every 3 seconds
      
      return () => clearInterval(interval);
    }
  }, [allImages.length]);

  if (allImages.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>
        <div className="text-center p-8">
          <div className="text-4xl mb-2">📸</div>
          <p className="text-sm text-muted-foreground">Empty Project</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden bg-black`}>
      {/* Main Image */}
      <div className="relative w-full h-full">
        <Image
          src={allImages[currentIndex]}
          alt={`Generated image ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Navigation Arrows - Show on hover if multiple images */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % allImages.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {allImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Count Badge */}
      {allImages.length > 1 && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {currentIndex + 1} / {allImages.length}
        </div>
      )}
    </div>
  );
}