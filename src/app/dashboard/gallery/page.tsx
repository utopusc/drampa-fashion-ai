"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuroraText } from "@/components/magicui/aurora-text";

interface GalleryItem {
  id: string;
  image: string;
  prompt: string;
  model: string;
  style: string;
  createdAt: string;
}

const DashboardGallery = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Hook'lar conditional return'lerden önce olmalı
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

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
  
  // Demo gallery data with actual images from the gallery folder
  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      image: "/assets/gallery/yyOLRTTdLlW8EbmL03aLnQ.jpg",
      prompt: "Professional fashion model wearing elegant evening dress in studio setting",
      model: "Aria",
      style: "Studio Professional",
      createdAt: "2024-06-03"
    },
    {
      id: "2", 
      image: "/assets/gallery/ydAiEgEy97IirXF66ych-Lq6aIw.webp",
      prompt: "Casual streetwear outfit with modern urban background and natural lighting",
      model: "Sophia",
      style: "Urban Casual",
      createdAt: "2024-06-03"
    },
    {
      id: "3",
      image: "/assets/gallery/XRGSA2yky9adhJCqjUkvbA.jpg", 
      prompt: "Summer collection beachwear with tropical background and bright colors",
      model: "Mia",
      style: "Beach Lifestyle",
      createdAt: "2024-06-02"
    },
    {
      id: "4",
      image: "/assets/gallery/uMlilk9A0v2BAe9Y9tJMNQ.jpg",
      prompt: "Business formal attire in corporate office environment with clean aesthetics",
      model: "Zoe",
      style: "Corporate Formal",
      createdAt: "2024-06-02"
    },
    {
      id: "5",
      image: "/assets/gallery/S2L90stoJrIuTKo9y-Fg3A.jpg",
      prompt: "Bohemian style dress with natural outdoor setting and soft warm lighting",
      model: "Aria",
      style: "Bohemian Natural",
      createdAt: "2024-06-01"
    },
    {
      id: "6",
      image: "/assets/gallery/QvqQtqjMCCUe7S75KOuVPg.jpg",
      prompt: "Sports activewear collection with dynamic poses and energetic atmosphere",
      model: "Noelle",
      style: "Active Sports",
      createdAt: "2024-06-01"
    },
    {
      id: "7", 
      image: "/assets/gallery/pN3DhKTjkXsIQ5FkCXYJGw.jpg",
      prompt: "Vintage-inspired outfit with retro background and classic styling elements",
      model: "Ivy",
      style: "Vintage Classic",
      createdAt: "2024-05-31"
    },
    {
      id: "8",
      image: "/assets/gallery/nSadEGMtG4JTxK_okr7mzw.jpg",
      prompt: "High fashion couture piece with dramatic lighting and artistic composition",
      model: "Sophia",
      style: "High Fashion",
      createdAt: "2024-05-31"
    },
    {
      id: "9",
      image: "/assets/gallery/ET-_xFCkTao8MG6LM2-_yw.jpg",
      prompt: "Minimalist fashion with clean lines and neutral background tones",
      model: "Mia",
      style: "Minimalist Modern",
      createdAt: "2024-05-30"
    },
    {
      id: "10",
      image: "/assets/gallery/B2YFCT20auU886jEj4Jjfw.jpg",
      prompt: "Evening gown collection with elegant pose and luxurious backdrop",
      model: "Aria",
      style: "Evening Luxury",
      createdAt: "2024-05-30"
    },
    {
      id: "11",
      image: "/assets/gallery/9_oUNvSvaMpfEoc33-d8Bw.jpg",
      prompt: "Casual weekend wear with comfortable styling and relaxed atmosphere",
      model: "Zoe",
      style: "Weekend Casual",
      createdAt: "2024-05-29"
    },
    {
      id: "12",
      image: "/assets/gallery/1Q5nfqQYumsblxDqvumbbQ.jpg",
      prompt: "Designer accessories showcase with focus on details and craftsmanship",
      model: "Ivy",
      style: "Accessory Focus",
      createdAt: "2024-05-29"
    }
  ];

  const filters = ["all", "Studio Professional", "Urban Casual", "Beach Lifestyle", "Corporate Formal", "Bohemian Natural", "Active Sports"];

  const filteredItems = selectedFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.style === selectedFilter);

  // Orange theme colors for Aurora effect
  const orangeAuroraColors = ["#FF7722", "#FF9933", "#FFB366", "#FFC999"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            <AuroraText colors={orangeAuroraColors} speed={0.8}>
              AI Gallery
            </AuroraText>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium mb-8">
            Explore stunning AI-generated fashion photography created by our community
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>{galleryItems.length} Generated Images</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>12 AI Models Used</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>8 Different Styles</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === filter
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter === "all" ? "All Styles" : filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-muted shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:border-primary/20 border border-transparent">
                {/* Image with 640x965 aspect ratio (approximately 2:3) */}
                <div className="aspect-[2/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.prompt}
                    width={640}
                    height={965}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={index < 8}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyugOBKxuLylVyqIi8iIL1VQYXfiX0A/9k="
                  />
                </div>
                
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium bg-primary px-2 py-1 rounded-full">
                        {item.model}
                      </span>
                      <span className="text-xs text-white/80">
                        {item.createdAt}
                      </span>
                    </div>
                    <p className="font-semibold text-sm leading-tight line-clamp-2">
                      {item.prompt}
                    </p>
                    <p className="text-xs text-white/70">
                      Style: {item.style}
                    </p>
                  </div>
                </div>
                
                {/* Hover icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl">
            Load More Creations
          </button>
        </motion.div>
      </div>

      {/* Modal for detailed view */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[2/3] overflow-hidden rounded-2xl">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.prompt}
                  width={640}
                  height={965}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Generation Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Prompt</label>
                      <p className="text-foreground mt-1">{selectedItem.prompt}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">AI Model</label>
                        <p className="text-foreground mt-1">{selectedItem.model}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Style</label>
                        <p className="text-foreground mt-1">{selectedItem.style}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Created</label>
                      <p className="text-foreground mt-1">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-full bg-muted hover:bg-muted/80 text-foreground font-medium px-6 py-3 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardGallery; 