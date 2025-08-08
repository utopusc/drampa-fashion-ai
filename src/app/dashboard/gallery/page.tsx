"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuroraText } from "@/components/magicui/aurora-text";
import imageService, { GeneratedImageData } from "@/services/imageService";
import productService, { Product } from "@/services/productService";
import { getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import { Package2, Sparkles } from "lucide-react";

const DashboardGallery = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Hook'lar conditional return'lerden önce olmalı
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<GeneratedImageData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [galleryItems, setGalleryItems] = useState<GeneratedImageData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'all' | 'ai' | 'products'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  // Fetch images and products when component mounts or page changes
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoadingImages(true);
        
        // Fetch both AI images and products in parallel
        const [imagesResponse, productsResponse] = await Promise.all([
          imageService.getUserImages({ 
            page: currentPage, 
            limit: 12,
            sortBy: 'createdAt'
          }),
          productService.getUserProducts({
            page: currentPage,
            limit: 12
          })
        ]);
        
        if (imagesResponse.success) {
          setGalleryItems(imagesResponse.images);
          setTotalPages(imagesResponse.totalPages);
        }
        
        if (productsResponse.success) {
          setProducts(productsResponse.products);
        }
      } catch (error) {
        console.error('Failed to fetch gallery data:', error);
        toast.error('Failed to load gallery');
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchData();
  }, [user, currentPage, viewMode]);

  // Show loading while checking auth or loading images
  if (loading || isLoadingImages) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{loading ? 'Loading...' : 'Loading gallery...'}</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }
  
  // Extract unique styles from gallery items
  const extractedStyles = galleryItems.reduce((acc, item) => {
    item.styleItems.forEach(styleItem => {
      if (styleItem.type === 'fashion' && !acc.includes(styleItem.name)) {
        acc.push(styleItem.name);
      }
    });
    return acc;
  }, [] as string[]);

  const filters = ["all", ...extractedStyles];

  const filteredItems = selectedFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => 
        item.styleItems.some(styleItem => 
          styleItem.type === 'fashion' && styleItem.name === selectedFilter
        )
      );
  
  // Combine items based on view mode
  const getDisplayItems = () => {
    if (viewMode === 'ai') return filteredItems;
    if (viewMode === 'products') return products;
    // For 'all' mode, combine both
    return [...filteredItems, ...products];
  };
  
  const displayItems = getDisplayItems();

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
            Explore stunning AI-generated fashion photography and products
          </p>
          
          {/* View Mode Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setViewMode('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'all'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setViewMode('ai')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === 'ai'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Generated
            </button>
            <button
              onClick={() => setViewMode('products')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === 'products'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <Package2 className="w-4 h-4" />
              Products
            </button>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>{galleryItems.length} AI Images</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{products.length} Products</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>{galleryItems.length + products.length} Total Items</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Section - Only show for AI view */}
        {viewMode === 'ai' && (
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
        )}

        {/* Gallery Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {displayItems.map((item: any, index: number) => {
            const isProduct = 'category' in item;
            
            return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => {
                if (isProduct) {
                  setSelectedProduct(item);
                } else {
                  setSelectedItem(item);
                }
              }}
            >
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-muted shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:border-primary/20 border border-transparent">
                {/* Image with actual dimensions */}
                <div className="aspect-[2/3] overflow-hidden">
                  {isProduct ? (
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.prompt}
                      width={item.metadata.width || 640}
                      height={item.metadata.height || 965}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={index < 8}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyugOBKxuLylVyqIi8iIL1VQYXfiX0A/9k="
                    />
                  )}
                </div>
                
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isProduct ? (
                        <>
                          <span className="text-xs font-medium bg-orange-600 px-2 py-1 rounded-full flex items-center gap-1">
                            <Package2 className="w-3 h-3" />
                            Product
                          </span>
                          <span className="text-xs text-white/80">
                            {item.category}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-medium bg-primary px-2 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {item.model.name}
                          </span>
                          <span className="text-xs text-white/80">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="font-semibold text-sm leading-tight line-clamp-2">
                      {isProduct ? item.name : item.prompt}
                    </p>
                    <p className="text-xs text-white/70">
                      {isProduct 
                        ? `${item.type} • ${item.usageCount || 0} uses`
                        : (item.styleItems.filter(s => s.type === 'fashion').map(s => s.name).join(', ') || 'No style')
                      }
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
          );
          })}
        </motion.div>

        {/* Load More Button or Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Previous
              </button>
              <span className="text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium px-6 py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
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
                  src={selectedItem.url}
                  alt={selectedItem.prompt}
                  width={selectedItem.metadata.width || 640}
                  height={selectedItem.metadata.height || 965}
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
                        <p className="text-foreground mt-1">{selectedItem.model.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Styles</label>
                        <p className="text-foreground mt-1">
                          {selectedItem.styleItems.map(s => s.name).join(', ') || 'None'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Created</label>
                      <p className="text-foreground mt-1">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Size</label>
                        <p className="text-foreground mt-1">{selectedItem.metadata.imageSize}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Dimensions</label>
                        <p className="text-foreground mt-1">{selectedItem.metadata.width} × {selectedItem.metadata.height}</p>
                      </div>
                    </div>
                    {selectedItem.project && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Project</label>
                        <p className="text-foreground mt-1">{selectedItem.project.name}</p>
                      </div>
                    )}
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
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={getImageUrl(selectedProduct.imageUrl)}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Package2 className="w-8 h-8 text-orange-600" />
                    <h2 className="text-2xl font-bold text-foreground">Product Details</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-foreground mt-1 text-lg font-semibold">{selectedProduct.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                        <p className="text-foreground mt-1 capitalize">{selectedProduct.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Category</label>
                        <p className="text-foreground mt-1">{selectedProduct.category}</p>
                      </div>
                    </div>
                    {selectedProduct.description && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="text-foreground mt-1">{selectedProduct.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Usage Count</label>
                        <p className="text-foreground mt-1">{selectedProduct.usageCount || 0} times</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Uploaded</label>
                        <p className="text-foreground mt-1">{new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tags</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProduct.tags.map((tag: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-muted text-sm rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border flex gap-3">
                  <button 
                    onClick={() => {
                      router.push(`/create?product=${selectedProduct._id}`);
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Try On with AI
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-xl transition-colors"
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