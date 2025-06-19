"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuroraText } from "@/components/magicui/aurora-text";
import { 
  ArrowDownTrayIcon, 
  ShareIcon, 
  HeartIcon, 
  SparklesIcon,
  PhotoIcon,
  ClockIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  style: string;
  liked: boolean;
}

const ResultsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Simulate AI generation process
    const generateImages = async () => {
      setIsGenerating(true);
      
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated results
      const mockResults: GeneratedImage[] = [
        {
          id: "1",
          url: "/assets/gallery/yyOLRTTdLlW8EbmL03aLnQ.jpg",
          prompt: "Professional fashion model wearing elegant evening dress in studio setting",
          model: "Aria",
          style: "Studio Professional",
          liked: false
        },
        {
          id: "2", 
          url: "/assets/gallery/ydAiEgEy97IirXF66ych-Lq6aIw.webp",
          prompt: "Casual streetwear outfit with modern urban background and natural lighting",
          model: "Sophia",
          style: "Urban Casual",
          liked: false
        },
        {
          id: "3",
          url: "/assets/gallery/XRGSA2yky9adhJCqjUkvbA.jpg", 
          prompt: "Summer collection beachwear with tropical background and bright colors",
          model: "Mia",
          style: "Beach Lifestyle",
          liked: false
        },
        {
          id: "4",
          url: "/assets/gallery/uMlilk9A0v2BAe9Y9tJMNQ.jpg",
          prompt: "Business formal attire in corporate office environment with clean aesthetics",
          model: "Zoe",
          style: "Corporate Formal",
          liked: false
        }
      ];
      
      setGeneratedImages(mockResults);
      setIsGenerating(false);
    };

    generateImages();
  }, []);

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

  const toggleLike = (imageId: string) => {
    setGeneratedImages(prev => 
      prev.map(img => 
        img.id === imageId ? { ...img, liked: !img.liked } : img
      )
    );
  };

  const handleDownload = async (image: GeneratedImage) => {
    setDownloadingId(image.id);
    
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would download the actual file
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `drampa-generated-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleShare = (image: GeneratedImage) => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Generated Fashion Photo',
        text: `Check out this amazing AI-generated fashion photo created with DRAMPA!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Orange theme colors for Aurora effect
  const orangeAuroraColors = ["#FF7722", "#FF9933", "#FFB366", "#FFC999"];

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-muted-foreground/20"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF7722" />
                      <stop offset="100%" stopColor="#FFB366" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <SparklesIcon className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              <AuroraText colors={orangeAuroraColors} speed={0.8}>
                Generating
              </AuroraText>{" "}
              Your Photos
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Our AI is working its magic to create stunning fashion photos with your selected models and backgrounds.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <ClockIcon className="w-5 h-5" />
                <span>Estimated time: 2-3 minutes</span>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span>Processing images</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  />
                  <span>Applying AI models</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                  />
                  <span>Finalizing results</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              <AuroraText colors={orangeAuroraColors} speed={0.8}>
                Generation Complete!
              </AuroraText>
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Your AI-generated fashion photos are ready! Download, share, or save your favorites to your gallery.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <PhotoIcon className="w-4 h-4" />
              <span>{generatedImages.length} Images Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              <span>High Quality 4K</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>Generated in 3 minutes</span>
            </div>
          </div>
        </motion.div>

        {/* Generated Images Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12"
        >
          {generatedImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.prompt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(image.id);
                    }}
                    className="w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    {image.liked ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-foreground" />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(image);
                    }}
                    className="w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ShareIcon className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Model: {image.model}</h3>
                    <p className="text-sm text-muted-foreground">{image.style}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(image)}
                    disabled={downloadingId === image.id}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {downloadingId === image.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    )}
                    <span>{downloadingId === image.id ? 'Downloading...' : 'Download'}</span>
                  </button>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {image.prompt}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/create">
            <button className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
              Create Another Project
            </button>
          </Link>
          
          <Link href="/dashboard/gallery">
            <button className="w-full sm:w-auto px-8 py-4 bg-card border border-border text-foreground rounded-xl hover:bg-muted transition-colors font-medium">
              View Full Gallery
            </button>
          </Link>
          
          <Link href="/dashboard">
            <button className="w-full sm:w-auto px-8 py-4 bg-card border border-border text-foreground rounded-xl hover:bg-muted transition-colors font-medium">
              Back to Dashboard
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="max-w-4xl max-h-[90vh] bg-background rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.prompt}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Model: {selectedImage.model}</h3>
              <p className="text-muted-foreground mb-4">{selectedImage.style}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedImage.prompt}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Wrapper component with Suspense
const ResultsPageWrapper = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ResultsPage />
    </Suspense>
  );
};

export default ResultsPageWrapper; 