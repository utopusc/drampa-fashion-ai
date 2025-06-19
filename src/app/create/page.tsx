"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/navbar";
import { useAuth } from "@/contexts/AuthContext";

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

const Create = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  const options: OptionCardProps[] = [
    {
      id: "on-model",
      title: "On-Model Photos",
      description: "Start with a photo of someone wearing your product. Easily switch to our models and backgrounds.",
      badge: "Highest Quality",
      imageSrc: "/assets/on-model-thumb.jpg",
      videoSrc: "/assets/on-model-video.mp4",
      href: "/create/on-model"
    },
    {
      id: "flat-lay",
      title: "Flat-Lay Photos",
      description: "Start with a simple flat-lay photo of your product. Easily create professional on-model images.",
      badge: "Beta",
      imageSrc: "/assets/flat-lay-thumb.jpg",
      videoSrc: "/assets/flat-lay-video.mp4",
      href: "/create/flat-lay"
    },
    {
      id: "mannequin",
      title: "Mannequin Photos",
      description: "Start with a simple mannequin photo of your product. Easily create professional on-model images.",
      badge: "Beta",
      imageSrc: "/assets/mannequin-thumb.jpg",
      href: "/create/mannequin"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-foreground mb-6">Create New Project</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the type of photo you want to work with and start creating amazing AI-generated fashion visuals.
          </p>
        </motion.div>

        {/* Options Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {options.map((option, index) => (
            <OptionCard key={option.id} option={option} index={index} />
          ))}
        </motion.div>

        {/* Quick Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Upload Products</h3>
              <p className="text-muted-foreground text-sm">Upload your product images in any supported format</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Select Models</h3>
              <p className="text-muted-foreground text-sm">Choose from our diverse gallery of AI models</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Generate</h3>
              <p className="text-muted-foreground text-sm">AI creates professional fashion photos in minutes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Individual Option Card Component
interface OptionCardComponentProps {
  option: OptionCardProps;
  index: number;
}

const OptionCard = ({ option, index }: OptionCardComponentProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && option.videoSrc) {
      videoRef.current.play().catch(error => console.error("Video play error:", error));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && option.videoSrc) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${option.imageSrc}`);
    setImageError(true);
  };

  // Helper function to get the appropriate badge colors
  const getBadgeStyles = (badge: string) => {
    if (badge === "Highest Quality") {
      return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700";
    }
    return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
  };

  const iconMap = {
    "on-model": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    "flat-lay": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
      </svg>
    ),
    "mannequin": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link href={option.href}>
        <motion.div 
          className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all cursor-pointer h-full hover:border-primary/20"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Visual Preview Section */}
          <div className="relative h-80 bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
            {/* Badge */}
            <div className="absolute top-6 left-6 z-10">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getBadgeStyles(option.badge)}`}>
                {option.badge}
              </span>
            </div>

            {/* Main Image/Video Container */}
            <div className="relative h-full w-full">
              {/* Static Image */}
              {!imageError ? (
                <img 
                  src={option.imageSrc} 
                  alt={option.title}
                  onError={handleImageError}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isHovered && option.videoSrc ? 'opacity-0' : 'opacity-100'}`}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center bg-muted transition-opacity duration-500 ${isHovered && option.videoSrc ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="text-muted-foreground">
                    {iconMap[option.id as keyof typeof iconMap]}
                  </div>
                </div>
              )}

              {/* Video Overlay */}
              {option.videoSrc && (
                <video 
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  loop
                  muted
                  playsInline
                >
                  <source src={option.videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="bg-muted p-3 rounded-xl text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {iconMap[option.id as keyof typeof iconMap]}
                </span>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {option.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base">
                {option.description}
              </p>
            </div>
            
            <motion.button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 group-hover:shadow-lg transform group-hover:scale-105 duration-300"
              whileTap={{ scale: 0.95 }}
            >
              Start Creating
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default Create; 