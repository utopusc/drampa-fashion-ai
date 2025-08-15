"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const images = [
  "/assets/gallery/ydAiEgEy97IirXF66ych-7wP4ZQ.webp",
  "/assets/gallery/XRGSA2yky9adhJCqjUkvbA.jpg",
  "/assets/gallery/ydAiEgEy97IirXF66ych-IjG78g.webp",
  "/assets/gallery/ET-_xFCkTao8MG6LM2-_yw.jpg",
  "/assets/gallery/ydAiEgEy97IirXF66ych-Lq6aIw.webp",
  "/assets/gallery/B2YFCT20auU886jEj4Jjfw.jpg",
  "/assets/gallery/uMlilk9A0v2BAe9Y9tJMNQ.jpg",
  "/assets/gallery/QvqQtqjMCCUe7S75KOuVPg.jpg",
];

export default function AuthHeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      
      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center p-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Transform Your Fashion Business
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Create stunning product photos with AI-powered virtual models
          </p>
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentImageIndex]}
                alt="Fashion AI Model"
                fill
                className="object-cover"
                priority
                onLoadingComplete={() => setIsLoading(false)}
              />
              {isLoading && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "w-8 bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 grid grid-cols-2 gap-4 text-sm"
        >
          {[
            "AI-Powered Models",
            "Professional Quality",
            "Fast Generation",
            "Custom Backgrounds",
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{feature}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}