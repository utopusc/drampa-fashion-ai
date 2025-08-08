"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuroraText } from "@/components/magicui/aurora-text";
import { getImageUrl } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { 
  Plus, 
  Upload,
  Package2,
  Tag,
  Shirt,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Sparkles,
  Grid3X3,
  List
} from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ProductUploadModal from "@/components/fashion-ai/ProductUploadModal";
import ProductEditModal from "@/components/fashion-ai/ProductEditModal";
import productService, { Product } from "@/services/productService";

export default function FashionAIPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const orangeAuroraColors = ["#FF7722", "#FF9933", "#FFB366", "#FFC999"];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user, selectedType, searchQuery]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await productService.getUserProducts({
        type: selectedType === 'all' ? undefined : selectedType,
        search: searchQuery || undefined
      });
      setProducts(response.products);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`);
    if (!confirmed) return;
    
    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'top':
        return { icon: Shirt, label: 'Top', color: 'bg-blue-500' };
      case 'bottom':
        return { icon: Package2, label: 'Bottom', color: 'bg-green-500' };
      case 'dress':
        return { icon: Sparkles, label: 'Dress', color: 'bg-purple-500' };
      case 'outerwear':
        return { icon: Tag, label: 'Outerwear', color: 'bg-orange-500' };
      default:
        return { icon: Package2, label: 'Product', color: 'bg-gray-500' };
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesType = selectedType === 'all' || product.type === selectedType;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            <AuroraText colors={orangeAuroraColors} speed={0.8}>
              Fashion AI Studio
            </AuroraText>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your products and create stunning AI-powered fashion photography with virtual try-on
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedType === 'all'
                    ? 'bg-white dark:bg-gray-900 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('top')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedType === 'top'
                    ? 'bg-white dark:bg-gray-900 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Tops
              </button>
              <button
                onClick={() => setSelectedType('bottom')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedType === 'bottom'
                    ? 'bg-white dark:bg-gray-900 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Bottoms
              </button>
              <button
                onClick={() => setSelectedType('dress')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedType === 'dress'
                    ? 'bg-white dark:bg-gray-900 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Dresses
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-900 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-900 text-orange-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium"
            >
              <Upload className="w-5 h-5" />
              Upload Product
            </button>
          </div>
        </motion.div>

        {/* Products Display */}
        {loadingProducts ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-2xl border border-orange-200 dark:border-orange-800/30 p-16"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Upload Your First Product</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Start by uploading your fashion products to use them in AI-generated photoshoots
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium text-lg"
              >
                Upload First Product
              </button>
            </div>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const productType = getProductTypeIcon(product.type);
                const Icon = productType.icon;
                
                return (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                    }`}>
                      <img 
                        src={getImageUrl(product.imageUrl)} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute top-3 left-3 px-3 py-1.5 ${productType.color} backdrop-blur-sm rounded-full flex items-center gap-1.5 text-white shadow-lg`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{productType.label}</span>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground mb-1 truncate group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                          {product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {product.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-muted text-xs rounded-full text-muted-foreground">
                                  {tag}
                                </span>
                              ))}
                              {product.tags.length > 3 && (
                                <span className="px-2 py-1 text-xs text-muted-foreground">
                                  +{product.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button 
                              className="p-1.5 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </DropdownMenu.Trigger>
                          
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content 
                              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-1.5 min-w-[180px] z-50"
                              sideOffset={5}
                            >
                              <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-muted cursor-pointer"
                                onClick={() => router.push(`/create?product=${product._id}`)}
                              >
                                <Eye className="w-4 h-4" />
                                Use in Editor
                              </DropdownMenu.Item>
                              
                              <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-muted cursor-pointer"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowEditModal(true);
                                }}
                              >
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </DropdownMenu.Item>
                              
                              <DropdownMenu.Separator className="h-px bg-border my-1" />
                              
                              <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-destructive/10 text-destructive cursor-pointer"
                                onClick={() => handleDeleteProduct(product._id, product.name)}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <ProductUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            loadProducts();
          }}
        />
      )}
      
      {/* Edit Modal */}
      {showEditModal && (
        <ProductEditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
            loadProducts();
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
}