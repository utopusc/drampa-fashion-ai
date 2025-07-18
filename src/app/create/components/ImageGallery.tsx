'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  Download, 
  Trash2, 
  Search,
  Filter,
  Grid3X3,
  Sparkles,
  Clock,
  FolderOpen,
  Star
} from 'lucide-react';
import Image from 'next/image';
import imageService, { GeneratedImageData } from '@/services/imageService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import ImageModal from '@/components/ImageModal';
import useProjectStore from '@/store/projectStore';

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageGallery({ isOpen, onClose }: ImageGalleryProps) {
  const [images, setImages] = useState<GeneratedImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'project'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentProject } = useProjectStore();

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, page, filter, currentProject?._id]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 20 };
      
      if (filter === 'favorites') {
        params.isFavorite = true;
      } else if (filter === 'project' && currentProject) {
        params.projectId = currentProject._id;
      }

      const response = await imageService.getUserImages(params);
      setImages(response.images);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (image: GeneratedImageData) => {
    try {
      const response = await imageService.toggleFavorite(image._id);
      setImages(images.map(img => 
        img._id === image._id ? { ...img, isFavorite: response.isFavorite } : img
      ));
      toast.success(response.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await imageService.deleteImage(imageId);
      setImages(images.filter(img => img._id !== imageId));
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const filteredImages = images.filter(img => 
    searchTerm ? img.prompt.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-96 bg-background border-r border-border shadow-2xl z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">Generated Images</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by prompt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="px-6 py-3 border-b border-border">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    filter === 'all' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                  All
                </button>
                <button
                  onClick={() => setFilter('favorites')}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    filter === 'favorites' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <Star className="w-4 h-4" />
                  Favorites
                </button>
                {currentProject && (
                  <button
                    onClick={() => setFilter('project')}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      filter === 'project' 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    <FolderOpen className="w-4 h-4" />
                    Current Project
                  </button>
                )}
              </div>
            </div>
            
            {/* Images Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredImages.map((image) => (
                    <motion.div
                      key={image._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <Image
                        src={image.url}
                        alt={image.prompt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 200px"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-end">
                        <p className="text-white text-xs line-clamp-2 mb-2">{image.prompt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-xs">
                            {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(image);
                              }}
                              className="p-1.5 bg-white/20 hover:bg-white/30 rounded transition-colors"
                            >
                              <Heart 
                                className={cn(
                                  "w-3.5 h-3.5",
                                  image.isFavorite ? "fill-red-500 text-red-500" : "text-white"
                                )}
                              />
                            </button>
                            <a
                              href={image.url}
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 bg-white/20 hover:bg-white/30 rounded transition-colors"
                            >
                              <Download className="w-3.5 h-3.5 text-white" />
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(image._id);
                              }}
                              className="p-1.5 bg-white/20 hover:bg-red-500/50 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Favorite Badge */}
                      {image.isFavorite && (
                        <div className="absolute top-2 right-2">
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "w-8 h-8 rounded text-sm font-medium transition-colors",
                        page === i + 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Image Modal */}
          <ImageModal
            isOpen={selectedImage !== null}
            onClose={() => setSelectedImage(null)}
            imageUrl={selectedImage || ''}
            imageAlt="Generated image"
          />
        </>
      )}
    </AnimatePresence>
  );
}