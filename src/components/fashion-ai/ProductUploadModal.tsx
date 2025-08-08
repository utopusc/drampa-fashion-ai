"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Image as ImageIcon,
  Tag,
  Plus,
  Loader2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import productService from '@/services/productService';

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const productTypes = [
  { value: 'top', label: 'Top', description: 'T-shirts, shirts, blouses, sweaters' },
  { value: 'bottom', label: 'Bottom', description: 'Pants, jeans, skirts, shorts' },
  { value: 'dress', label: 'Dress', description: 'Dresses, jumpsuits, one-pieces' },
  { value: 'outerwear', label: 'Outerwear', description: 'Jackets, coats, blazers' }
];

const commonCategories = {
  top: ['T-Shirt', 'Shirt', 'Blouse', 'Sweater', 'Tank Top', 'Polo', 'Hoodie', 'Crop Top'],
  bottom: ['Jeans', 'Pants', 'Skirt', 'Shorts', 'Leggings', 'Trousers', 'Cargo Pants'],
  dress: ['Casual Dress', 'Formal Dress', 'Maxi Dress', 'Mini Dress', 'Cocktail Dress', 'Jumpsuit'],
  outerwear: ['Jacket', 'Coat', 'Blazer', 'Denim Jacket', 'Leather Jacket', 'Windbreaker']
};

export default function ProductUploadModal({ isOpen, onClose, onSuccess }: ProductUploadModalProps) {
  const [productData, setProductData] = useState({
    name: '',
    type: '',
    category: '',
    description: '',
    tags: [] as string[],
    imageFile: null as File | null,
    imagePreview: ''
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleAddTag = () => {
    if (currentTag.trim() && !productData.tags.includes(currentTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productData.imageFile) {
      toast.error('Please upload a product image');
      return;
    }
    
    if (!productData.type) {
      toast.error('Please select a product type');
      return;
    }
    
    if (!productData.name.trim()) {
      toast.error('Please enter a product name');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = productService.createProductFormData({
        name: productData.name,
        type: productData.type,
        category: productData.category,
        description: productData.description,
        tags: productData.tags,
        imageFile: productData.imageFile
      });
      
      await productService.uploadProduct(formData);
      
      toast.success('Product uploaded successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload product');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-background rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Upload className="w-6 h-6 text-orange-500" />
                Upload Product
              </h2>
              <p className="text-muted-foreground mt-1">Add your fashion product to use in AI photoshoots</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Product Image</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' : 'border-border hover:border-orange-400'
                } ${productData.imagePreview ? 'bg-muted' : ''}`}
              >
                <input {...getInputProps()} />
                {productData.imagePreview ? (
                  <div className="relative">
                    <img
                      src={productData.imagePreview}
                      alt="Product preview"
                      className="max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <p className="mt-4 text-sm text-muted-foreground">Click or drag to replace image</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-1">
                      {isDragActive ? 'Drop the image here' : 'Drag & drop your product image'}
                    </p>
                    <p className="text-sm text-muted-foreground">or click to browse (JPG, PNG, WebP)</p>
                  </>
                )}
              </div>
            </div>

            {/* Product Type */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Product Type</label>
              <div className="grid grid-cols-2 gap-3">
                {productTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setProductData(prev => ({ ...prev, type: type.value, category: '' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      productData.type === type.value
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                        : 'border-border hover:border-orange-300'
                    }`}
                  >
                    <h4 className="font-medium text-foreground mb-1">{type.label}</h4>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Product Name</label>
              <input
                type="text"
                value={productData.name}
                onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Classic White T-Shirt"
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            {productData.type && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {commonCategories[productData.type as keyof typeof commonCategories]?.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description (Optional)
              </label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product's style, material, or unique features..."
                rows={3}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tags (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tags (e.g., casual, summer)"
                  className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {productData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {productData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-orange-900 dark:hover:text-orange-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors font-medium"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Upload Product
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}