"use client";

import {
  AnimatePresence,
  cubicBezier,
  motion,
  useAnimation,
  useInView,
} from "motion/react";
import { useEffect, useRef } from "react";

const fashionModels = [
  {
    id: 1,
    title: "Sophia",
    link: "#",
    image: "/assets/models/women/sophia-tdiGXw.webp",
    category: "Women"
  },
  {
    id: 2,
    title: "Marco",
    link: "#",
    image: "/assets/models/Men/marco-TAa_B3zm.webp",
    category: "Men"
  },
  {
    id: 3,
    title: "Aria",
    link: "#",
    image: "/assets/models/women/aria-165-Wg.webp",
    category: "Women"
  },
  {
    id: 4,
    title: "Julian",
    link: "#",
    image: "/assets/models/Men/julian-lHqmviLF.webp",
    category: "Men"
  },
  {
    id: 5,
    title: "Chloe",
    link: "#",
    image: "/assets/models/women/chloe-71yIXLLq.webp",
    category: "Women"
  },
  {
    id: 6,
    title: "Leo",
    link: "#",
    image: "/assets/models/Men/leo-G44hGlmA.webp",
    category: "Men"
  },
  {
    id: 7,
    title: "Mia",
    link: "#",
    image: "/assets/models/women/mia-5fIrACeF.webp",
    category: "Women"
  },
  {
    id: 8,
    title: "River",
    link: "#",
    image: "/assets/models/Men/river-psNzQEug.webp",
    category: "Men"
  },
  {
    id: 9,
    title: "Ivy",
    link: "#",
    image: "/assets/models/women/ivy-tHcN-Fsd.webp",
    category: "Women"
  },
];

export function FeatureCard10() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { amount: 0.25 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  return (
    <div className="flex h-full transform-gpu flex-col items-center justify-between gap-5 rounded-lg border border-neutral-200 bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] xl:flex-row">
      <div className="flex w-full flex-col items-start justify-between gap-y-10 p-10 xl:h-full xl:w-1/2">
        <h2 className="text-3xl font-semibold">
          Meet our diverse AI fashion models ready to showcase your products.
        </h2>
        <a
          href="/create"
          className="text-base font-normal text-primary underline-offset-4 transition-all hover:underline"
        >
          Start creating with AI models
        </a>
      </div>
      <div className="relative w-full overflow-hidden xl:w-1/2">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3 bg-gradient-to-b from-white dark:from-black"></div>
        <div
          ref={containerRef}
          className="relative -right-[50px] -top-[100px] grid max-h-[450px] grid-cols-3 gap-5 [transform:rotate(-15deg)translateZ(10px);]"
        >
          <AnimatePresence>
            {fashionModels.map((model, index) => (
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.96, y: 25 },
                  visible: { opacity: 1, scale: 1, y: 0 },
                }}
                initial="hidden"
                animate={controls}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transition: {
                    duration: 0.1,
                    ease: cubicBezier(0.22, 1, 0.36, 1),
                  },
                }}
                transition={{
                  duration: 0.2,
                  ease: cubicBezier(0.22, 1, 0.36, 1),
                  delay: index * 0.04,
                }}
                key={model.id}
                className="flex flex-col items-center gap-y-2 rounded-md border bg-white/5 p-5"
              >
                <img
                  src={model.image}
                  alt={model.title}
                  className="h-20 w-20 rounded-full object-cover object-top"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://avatar.vercel.sh/${model.title.toLowerCase()}`;
                  }}
                />
                <p className="text-sm dark:text-neutral-200/50 font-medium">{model.title}</p>
                <span className="rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary font-medium">
                  {model.category}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 