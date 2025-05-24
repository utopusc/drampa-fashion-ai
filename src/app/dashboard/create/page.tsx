"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { motion } from "motion/react";

// Option card data structure
interface OptionCardProps {
  id: string;
  title: string;
  description: string;
  badge: string;
  imageSrc: string;
  videoSrc?: string;
  href: string;
}

const CreatePage = () => {
  const options: OptionCardProps[] = [
    {
      id: "on-model",
      title: "On-Model Photos",
      description: "Start with a photo of someone wearing your product. Easily switch to our models and backgrounds.",
      badge: "Highest Quality",
      imageSrc: "/assets/on-model-thumb.jpg",
      videoSrc: "/assets/on-model-video.mp4",
      href: "/dashboard/create/on-model"
    },
    {
      id: "flat-lay",
      title: "Flat-Lay Photos",
      description: "Start with a simple flat-lay photo of your product. Easily create professional on-model images.",
      badge: "Beta Feature",
      imageSrc: "/assets/flat-lay-thumb.jpg",
      videoSrc: "/assets/flat-lay-video.mp4",
      href: "/dashboard/create/flat-lay"
    },
    {
      id: "mannequin",
      title: "Mannequin Photos",
      description: "Start with a simple mannequin photo of your product. Easily create professional on-model images.",
      badge: "Beta Feature",
      imageSrc: "/assets/mannequin-thumb.jpg",
      href: "/dashboard/create/mannequin"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Let's get started</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Simply choose the type of photo you want to upload: an on-model photo, a flat-lay, or a mannequin photo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-8 w-full">
        {options.map((option) => (
          <OptionCard key={option.id} {...option} />
        ))}
      </div>
    </div>
  );
};

const OptionCard = ({ id, title, description, badge, imageSrc, videoSrc, href }: OptionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(error => console.error("Video play error:", error));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && videoSrc) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageSrc}`);
    setImageError(true);
  };

  const iconMap = {
    "on-model": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    "flat-lay": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
      </svg>
    ),
    "mannequin": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    )
  };

  return (
    <motion.div 
      className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
      whileHover={{ y: -5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {videoSrc ? (
          <>
            {!imageError ? (
              <img 
                src={imageSrc} 
                alt={title} 
                onError={handleImageError}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
              />
            ) : (
              <div className={`absolute inset-0 w-full h-full flex items-center justify-center bg-[#FFF0E6] dark:bg-[#331400] transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <span className="text-[#FF7722] text-lg font-medium">{title}</span>
              </div>
            )}
            <video 
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              loop
              muted
              playsInline
            >
              <source src={videoSrc} type="video/mp4" />
              <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </>
        ) : (
          <>
            {!imageError ? (
              <img 
                src={imageSrc} 
                alt={title} 
                onError={handleImageError}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#FFF0E6] dark:bg-[#331400]">
                <span className="text-[#FF7722] text-lg font-medium">{title}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <span className="bg-[#FFF0E6] dark:bg-[#331400] text-[#FF7722] text-xs font-medium px-2.5 py-1 rounded-full">
              {badge}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-[#FFF0E6] dark:bg-[#331400] p-2 rounded-md text-[#FF7722]">
              {iconMap[id as keyof typeof iconMap]}
            </span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        
        <Link href={href} className="block mt-2">
          <button className="w-full bg-[#FF7722] hover:bg-[#E65100] text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center justify-center gap-2">
            Start Creating
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default CreatePage; 