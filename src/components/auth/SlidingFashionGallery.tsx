"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView, cubicBezier } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Professional fashion photos from gallery
const fashionGallery = [
  {
    id: 1,
    image: "/assets/gallery/ydAiEgEy97IirXF66ych-7wP4ZQ.webp",
  },
  {
    id: 2,
    image: "/assets/gallery/XRGSA2yky9adhJCqjUkvbA.jpg",
  },
  {
    id: 3,
    image: "/assets/gallery/ydAiEgEy97IirXF66ych-IjG78g.webp",
  },
  {
    id: 4,
    image: "/assets/gallery/ET-_xFCkTao8MG6LM2-_yw.jpg",
  },
  {
    id: 5,
    image: "/assets/gallery/ydAiEgEy97IirXF66ych-Lq6aIw.webp",
  },
  {
    id: 6,
    image: "/assets/gallery/B2YFCT20auU886jEj4Jjfw.jpg",
  },
  {
    id: 7,
    image: "/assets/gallery/uMlilk9A0v2BAe9Y9tJMNQ.jpg",
  },
  {
    id: 8,
    image: "/assets/gallery/QvqQtqjMCCUe7S75KOuVPg.jpg",
  },
  {
    id: 9,
    image: "/assets/gallery/pN3DhKTjkXsIQ5FkCXYJGw.jpg",
  },
  {
    id: 10,
    image: "/assets/gallery/nSadEGMtG4JTxK_okr7mzw.jpg",
  },
  {
    id: 11,
    image: "/assets/gallery/S2L90stoJrIuTKo9y-Fg3A.jpg",
  },
  {
    id: 12,
    image: "/assets/gallery/yyOLRTTdLlW8EbmL03aLnQ.jpg",
  }
];

export default function SlidingFashionGallery() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { amount: 0.25 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  // Triple the array for seamless infinite scroll
  const tripleGallery = [...fashionGallery, ...fashionGallery, ...fashionGallery];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">

      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-background to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-background to-transparent"></div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 md:h-32 bg-gradient-to-b from-background to-transparent"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 md:h-32 bg-gradient-to-t from-background to-transparent"></div>
      
      {/* Gallery container - Hidden on mobile, 2 cols on tablet, 3 cols on desktop */}
      <div
        ref={containerRef}
        className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 p-4 lg:p-6 xl:p-8 h-full [transform:rotate(-5deg)translateZ(10px)]"
      >
        {/* First Column */}
        <motion.div 
          className="flex flex-col gap-3 md:gap-4 lg:gap-6"
          animate={{ y: [0, -200] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {tripleGallery.slice(0, 9).map((model, index) => (
            <motion.div
              key={`col1-${model.id}-${index}`}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              initial="hidden"
              animate={controls}
              transition={{
                duration: 0.6,
                ease: cubicBezier(0.22, 1, 0.36, 1),
                delay: index * 0.05,
              }}
              className="rounded-xl md:rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden"
            >
              <div className="relative w-full h-32 md:h-40 lg:h-48 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src={model.image}
                  alt="Fashion Model"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Second Column */}
        <motion.div 
          className="flex flex-col gap-3 md:gap-4 lg:gap-6"
          animate={{ y: [-200, 0] }}
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {tripleGallery.slice(3, 12).map((model, index) => (
            <motion.div
              key={`col2-${model.id}-${index}`}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              initial="hidden"
              animate={controls}
              transition={{
                duration: 0.6,
                ease: cubicBezier(0.22, 1, 0.36, 1),
                delay: index * 0.05 + 0.1,
              }}
              className="rounded-xl md:rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden"
            >
              <div className="relative w-full h-32 md:h-40 lg:h-48 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src={model.image}
                  alt="Fashion Model"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Third Column - Only on desktop */}
        <motion.div 
          className="hidden xl:flex flex-col gap-3 md:gap-4 lg:gap-6"
          animate={{ y: [0, -200] }}
          transition={{ 
            duration: 32, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {tripleGallery.slice(6, 15).map((model, index) => (
            <motion.div
              key={`col3-${model.id}-${index}`}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              initial="hidden"
              animate={controls}
              transition={{
                duration: 0.6,
                ease: cubicBezier(0.22, 1, 0.36, 1),
                delay: index * 0.05 + 0.2,
              }}
              className="rounded-xl md:rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden"
            >
              <div className="relative w-full h-32 md:h-40 lg:h-48 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src={model.image}
                  alt="Fashion Model"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile fallback - Simple gradient background */}
      <div className="md:hidden flex items-center justify-center h-full">
        <div className="text-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
              DRAMPA
            </h3>
            <p className="text-muted-foreground">
              Professional fashion photography with AI
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}