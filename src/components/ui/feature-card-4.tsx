"use client";

import { cubicBezier, motion } from "motion/react";

export function FeatureCard4() {
  const variant1 = {
    initial: {
      x: 28,
      y: 8,
      scale: 0.85,
      rotate: -2,
      zIndex: 1,
      transition: {
        delay: 0.05,
        duration: 0.15,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      boxShadow:
        "rgba(255,119,34,0.2) 8px 16px 60px -15px, rgba(36,42,66,0.05) 0px 8px 20px -6px, rgba(36,42,66,0.08) 0px 2px 6px -2px",
      transition: {
        delay: 0.02,
        duration: 0.15,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };
  
  const variant2 = {
    initial: {
      scale: 1.08,
      zIndex: 3,
      transition: {
        delay: 0.05,
        duration: 0.15,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      scale: 1,
      boxShadow:
        "rgba(255,119,34,0.3) 0px 20px 60px -8px, rgba(36,42,66,0.06) 0px 12px 28px -8px, rgba(36,42,66,0.08) 0px 2px 8px -2px",
      transition: {
        delay: 0.02,
        duration: 0.15,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };
  
  const variant3 = {
    initial: {
      x: -28,
      y: 8,
      scale: 0.85,
      rotate: 2,
      zIndex: 1,
      transition: {
        delay: 0.05,
        duration: 0.15,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      boxShadow:
        "rgba(255,153,51,0.2) 0px 16px 60px -8px, rgba(36,42,66,0.05) 0px 8px 20px -6px, rgba(36,42,66,0.08) 0px 2px 6px -2px",
      transition: {
        delay: 0.02,
        duration: 0.15,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  const containerVariants = {
    initial: {},
    whileHover: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="relative h-full w-full max-w-[36rem] mx-auto transform-gpu rounded-3xl border border-border/60 bg-card/80 backdrop-blur-sm [box-shadow:0_0_0_1px_rgba(0,0,0,.02),0_3px_6px_rgba(0,0,0,.04),0_16px_32px_rgba(0,0,0,.06)] dark:bg-card/90 dark:[box-shadow:0_-20px_80px_-20px_#ffffff0f_inset] dark:[border:1px_solid_rgba(255,255,255,.08)] md:max-h-[520px] overflow-hidden hover:border-primary/30 transition-all duration-300">
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileHover="whileHover"
        className="flex h-full w-full cursor-pointer flex-col items-start justify-between group"
      >
        <div className="flex h-full w-full items-center justify-center rounded-t-3xl bg-gradient-to-br from-primary/8 via-primary/3 to-primary/12 p-6 md:p-10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,119,34,0.02)_50%,transparent_75%)] opacity-50"></div>
          
          <motion.div className="flex h-[260px] w-full items-center justify-between gap-x-3 md:gap-x-5 relative z-10">
            <motion.div
              variants={variant1}
              className="z-[2] flex h-fit w-full flex-col items-center justify-between gap-y-4 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-sm p-5 md:p-6 transition-all duration-200 ease-linear shadow-sm hover:shadow-xl group-hover:border-primary/20"
            >
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-0.5 shadow-lg">
                <img
                  className="h-full w-full rounded-full object-cover ring-2 ring-background"
                  src="/assets/models/women/sophia-tdiGXw.webp"
                  alt="AI Fashion Model Sophia"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/70 to-primary/50"></div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/50 to-primary/30"></div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/60 to-primary/40"></div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/80 to-primary/60"></div>
              </div>
              <div className="text-xs md:text-sm font-semibold text-foreground/90 text-center">Sophia</div>
            </motion.div>
            
            <motion.div
              variants={variant2}
              className="z-[3] flex h-fit w-full flex-col items-center justify-between gap-y-4 rounded-2xl border-2 border-primary/25 bg-background/98 backdrop-blur-sm p-5 md:p-6 transition-all duration-200 ease-linear shadow-lg hover:shadow-2xl ring-1 ring-primary/10"
            >
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-primary via-primary/95 to-primary/85 p-0.5 shadow-xl">
                <img
                  className="h-full w-full rounded-full object-cover ring-2 ring-background"
                  src="/assets/models/women/aria-165-Wg.webp"
                  alt="AI Fashion Model Aria"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/90 to-primary/70"></div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/80 to-primary/60"></div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/70 to-primary/50"></div>
              </div>
              <div className="text-xs md:text-sm font-bold text-foreground text-center">Aria</div>
            </motion.div>
            
            <motion.div
              variants={variant3}
              className="z-[2] flex h-fit w-full flex-col items-center justify-between gap-y-4 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-sm p-5 md:p-6 transition-all duration-200 ease-linear shadow-sm hover:shadow-xl group-hover:border-primary/20"
            >
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-0.5 shadow-lg">
                <img
                  className="h-full w-full rounded-full object-cover ring-2 ring-background"
                  src="/assets/models/women/mia-5fIrACeF.webp"
                  alt="AI Fashion Model Mia"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/60 to-primary/40"></div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/80 to-primary/60"></div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/50 to-primary/30"></div>
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-primary/90 to-primary/70"></div>
              </div>
              <div className="text-xs md:text-sm font-semibold text-foreground/90 text-center">Mia</div>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex w-full flex-col items-start border-t border-border/50 p-6 md:p-8 bg-gradient-to-r from-primary/8 via-primary/4 to-primary/8 group-hover:from-primary/12 group-hover:to-primary/12 transition-all duration-300">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">AI Model Gallery</h2>
          <p className="text-base md:text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            Choose from diverse AI fashion models
          </p>
        </div>
      </motion.div>
    </div>
  );
} 