"use client";

import { siteConfig } from "@/lib/config";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Sparkles, ArrowRight } from "lucide-react";
import { motion, useAnimation, useInView, cubicBezier } from "motion/react";
import { AuroraText } from "@/components/magicui/aurora-text";

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

export function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();

  // Orange theme colors for Aurora effect
  const orangeAuroraColors = ["#FF7722", "#FF9933", "#FFB366", "#FFC999"];

  // Continuous Sliding Fashion Gallery Component
  const SlidingFashionGallery = () => {
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
      <div className="relative w-full h-full overflow-hidden">
        {/* Floating badge */}
        <div className="absolute top-8 left-8 z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-foreground shadow-lg border border-primary/20"
          >
            <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
            50+ AI Models
          </motion.div>
        </div>

        {/* Gradient overlays for fade effect */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent"></div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-background to-transparent"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-background to-transparent"></div>
        
        <div
          ref={containerRef}
          className="relative grid grid-cols-3 gap-8 p-8 h-full [transform:rotate(-5deg)translateZ(10px)]"
        >
          {/* First Column */}
          <motion.div 
            className="flex flex-col gap-6"
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
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden"
              >
                <div className="relative w-full h-48 rounded-2xl overflow-hidden">
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
            className="flex flex-col gap-6"
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
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden"
              >
                <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                  <img
                    src={model.image}
                    alt="Fashion Model"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Third Column */}
          <motion.div 
            className="flex flex-col gap-6"
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
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden"
              >
                <div className="relative w-full h-48 rounded-2xl overflow-hidden">
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
      </div>
    );
  };

  return (
    <section id="hero" className="w-full relative overflow-hidden pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20 bg-background min-h-screen flex items-center">
      <div className="absolute inset-0 -z-10">
        <DotPattern 
          width={40}
          height={40}
          cr={4}
          glow={false}
          className="opacity-60"
        />
      </div>
      
      {/* Full width container */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh] max-w-[1400px] mx-auto">
          {/* Left Column: Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 lg:pr-8"
          >
            <div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex h-8 items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 text-sm font-medium text-primary"
              >
                <Sparkles className="w-4 h-4" />
                AI Fashion Photography Revolution
              </motion.p>
            </div>

            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight"
              >
                Create{" "}
                <AuroraText colors={orangeAuroraColors} speed={0.6}>
                  Professional
                </AuroraText>{" "}
                Fashion Photos in Minutes
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-muted-foreground font-normal leading-relaxed max-w-lg"
              >
                Transform your fashion products with AI-powered virtual models. 
                No expensive photoshoots, no complex setup - just stunning results in minutes.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
              >
                <Button 
                  size="lg"
                  onClick={() => router.push(user ? "/dashboard" : "/auth/sign-up")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-base font-medium h-12"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                {!user && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => router.push("/auth/sign-in")}
                    className="px-8 py-4 text-base font-medium h-12"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-3 gap-6 pt-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10x</div>
                  <div className="text-sm text-muted-foreground">Faster</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">90%</div>
                  <div className="text-sm text-muted-foreground">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">AI Models</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right Column: Sliding Fashion Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            <SlidingFashionGallery />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
