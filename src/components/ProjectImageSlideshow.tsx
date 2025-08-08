"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectImageSlideshowProps {
  images?: string[];
  nodes?: any[];
  projectName?: string;
  className?: string;
}

export default function ProjectImageSlideshow({ images, nodes, projectName = 'Project', className }: ProjectImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Extract images from nodes if nodes provided
  const allImages = images || (nodes ? nodes.flatMap(node => {
    // Handle both direct URL strings and image objects
    if (node.data?.generatedImages) {
      return node.data.generatedImages.map((img: any) => {
        // If it's already a string URL, use it directly
        if (typeof img === 'string') return img;
        // If it's an object with url property, extract it
        if (img?.url) return img.url;
        // Otherwise return null and filter it out
        return null;
      }).filter(Boolean);
    }
    return [];
  }) : []);
  
  // Debug log
  console.log('ProjectImageSlideshow - nodes:', nodes, 'allImages:', allImages);

  // Auto-play slideshow
  useEffect(() => {
    if (!isHovered && allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isHovered, allImages.length]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  if (allImages.length === 0) {
    return (
      <div className={`${className || ''} bg-muted flex items-center justify-center`}>
        <p className="text-muted-foreground text-sm">No images yet</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-muted overflow-hidden group ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <Image
        src={allImages[currentIndex]}
        alt={`${projectName} - Image ${currentIndex + 1}`}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Navigation Arrows - Only show if more than 1 image */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCurrentIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image Counter */}
      {allImages.length > 1 && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {currentIndex + 1}/{allImages.length}
        </div>
      )}
    </div>
  );
}