"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon, 
  PlusIcon, 
  MinusIcon,
  Bars3Icon,
  Square3Stack3DIcon,
  CubeIcon,
  ScissorsIcon,
  SparklesIcon,
  CommandLineIcon,
  UserIcon,
  PhotoIcon,
  CameraIcon,
  SwatchIcon,
  AdjustmentsHorizontalIcon,
  BeakerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid';
import { Check, Loader2, Package2, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePipelineStore } from '@/store/pipelineStore';
import { toast } from 'react-hot-toast';
import CleanModelNode from './nodes/CleanModelNode';
import { models } from '@/data/models';
import generationService from '@/services/generationService';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { backgrounds } from '@/data/backgrounds';
import { poses } from '@/data/poses';
import { fashionStyles } from '@/data/fashionStyles';
import { VerticalMenuBar, VerticalMenuBarItem } from '@/components/ui/vertical-menu';
import useProjectStore from '@/store/projectStore';
import imageService, { GeneratedImageData } from '@/services/imageService';
import productService, { Product } from '@/services/productService';
import fashnService from '@/services/fashnService';
import projectService from '@/services/projectService';
import { getImageUrl } from '@/lib/utils';
import FashnApiInit from './FashnApiInit';

// Vertical menu items for sidebar
const createMenuItems = (activeTab: string, setActiveTab: (tab: string) => void): VerticalMenuBarItem[] => [
  {
    icon: (props) => <UserIcon {...props} />,
    label: 'Model',
    onClick: () => setActiveTab('model'),
    isActive: activeTab === 'model'
  },
  {
    icon: (props) => <PhotoIcon {...props} />,
    label: 'Background',
    onClick: () => setActiveTab('background'),
    isActive: activeTab === 'background'
  },
  {
    icon: (props) => <CameraIcon {...props} />,
    label: 'Pose',
    onClick: () => setActiveTab('pose'),
    isActive: activeTab === 'pose'
  },
  {
    icon: (props) => <SwatchIcon {...props} />,
    label: 'Style',
    onClick: () => setActiveTab('style'),
    isActive: activeTab === 'style'
  },
  {
    icon: (props) => <Bars3Icon {...props} />,
    label: 'Size',
    onClick: () => setActiveTab('size'),
    isActive: activeTab === 'size'
  },
  {
    icon: (props) => <AdjustmentsHorizontalIcon {...props} />,
    label: 'Settings',
    onClick: () => setActiveTab('settings'),
    isActive: activeTab === 'settings'
  },
  {
    icon: (props) => <BeakerIcon {...props} />,
    label: 'Advanced',
    onClick: () => setActiveTab('advanced'),
    isActive: activeTab === 'advanced'
  },
  {
    icon: (props) => <SparklesIcon {...props} />,
    label: 'Fashion',
    onClick: () => setActiveTab('fashion'),
    isActive: activeTab === 'fashion'
  }
];

// Orientation presets with Fal AI format
const orientationPresets = [
  { label: 'Square HD', value: 'square_hd', width: 1024, height: 1024, icon: '□' },
  { label: 'Square', value: 'square', width: 512, height: 512, icon: '▫' },
  { label: 'Portrait 4:3', value: 'portrait_4_3', width: 768, height: 1024, icon: '▭' },
  { label: 'Portrait 16:9', value: 'portrait_16_9', width: 576, height: 1024, icon: '│' },
  { label: 'Landscape 4:3', value: 'landscape_4_3', width: 1024, height: 768, icon: '▬' },
  { label: 'Landscape 16:9', value: 'landscape_16_9', width: 1024, height: 576, icon: '━' }
];

// Size options
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

// Ethnicity options
const ethnicities = ['Random', 'Asian', 'Black', 'Caucasian', 'Hispanic', 'Middle Eastern', 'Mixed'];

interface PortraitEditorProps {
  onGenerateClick?: () => void;
}

export default function PortraitEditor({ onGenerateClick }: PortraitEditorProps) {
  let nodes: any[] = [];
  let addNode: any;
  let selectedNodeId: any;
  let updateNode: any;
  let selectNode: any;
  
  try {
    const store = usePipelineStore();
    nodes = store.nodes || [];
    addNode = store.addNode;
    selectedNodeId = store.selectedNodeId;
    updateNode = store.updateNode;
    selectNode = store.selectNode;
  } catch (error) {
    console.error('Error accessing pipeline store:', error);
  }
  
  console.log('PortraitEditor loaded, nodes:', nodes.length);
  const [activeTool, setActiveTool] = useState<string | null>('add');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('model');
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(-1);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Get the main model node first
  const modelNode = nodes.find(node => node.type === 'modelNode');
  const selectedModel = modelNode?.data?.model;
  
  // Portrait settings - initialize after modelNode is defined
  const [description, setDescription] = useState(modelNode?.data?.prompt || '');
  const [orientation, setOrientation] = useState('square_hd');
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(-32);
  const [saturation, setSaturation] = useState(47);
  const [selectedBodyType, setSelectedBodyType] = useState<string>('m');
  const [ethnicity, setEthnicity] = useState('Random');
  
  // Selected items
  const [selectedBackground, setSelectedBackground] = useState<any>(null);
  const [selectedPose, setSelectedPose] = useState<any>(null);
  const [selectedClothes, setSelectedClothes] = useState<any[]>([]);
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [fastFashionMode, setFastFashionMode] = useState(false);
  
  // Gallery states
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [allGeneratedImages, setAllGeneratedImages] = useState<GeneratedImageData[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  
  // Carousel states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favoriteImages, setFavoriteImages] = useState<Set<number>>(new Set());
  
  // Fashion AI states
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isGeneratingTryOn, setIsGeneratingTryOn] = useState(false);
  
  // Project store integration
  const { currentProject, updateProject } = useProjectStore();
  
  // Load images from localStorage on mount and project change
  useEffect(() => {
    const projectId = window.location.search.includes('project=') 
      ? new URLSearchParams(window.location.search).get('project') 
      : null;
      
    if (projectId) {
      const savedImages = localStorage.getItem(`portrait-images-${projectId}`);
      if (savedImages) {
        try {
          const images = JSON.parse(savedImages);
          if (Array.isArray(images) && images.length > 0) {
            // Update modelNode with saved images
            if (modelNode && updateNode) {
              updateNode(modelNode.id, {
                ...modelNode.data,
                generatedImages: images
              });
            }
          }
        } catch (error) {
          console.error('Error loading saved images:', error);
        }
      }
    }
  }, [currentProject?._id]);
  
  // Size definitions (body types)
  const sizes = [
    { value: 'xs', label: 'XS', description: 'extra small, very thin body type' },
    { value: 's', label: 'S', description: 'small, thin body type' },
    { value: 'm', label: 'M', description: 'medium, normal weight' },
    { value: 'l', label: 'L', description: 'large, athletic build' },
    { value: 'xl', label: 'XL', description: 'extra large, fuller figure' }
  ];
  
  // Save UI state to project
  const saveUIState = useCallback(() => {
    if (!currentProject) return;
    
    const uiState = {
      selectedModel: nodes.find(n => n.type === 'cleanModel')?.data || null,
      selectedBodyType,
      fastFashionMode,
      description,
      orientation,
      brightness,
      contrast,
      saturation,
      ethnicity,
      selectedBackground,
      selectedPose,
      selectedClothes,
      gender
    };
    
    updateProject({ uiState });
  }, [
    currentProject, 
    nodes, 
    selectedBodyType, 
    fastFashionMode, 
    description, 
    orientation, 
    brightness, 
    contrast, 
    saturation, 
    ethnicity,
    selectedBackground,
    selectedPose,
    selectedClothes,
    gender,
    updateProject
  ]);
  
  // Auto-slide to new image when images change
  useEffect(() => {
    if (modelNode?.data?.generatedImages && modelNode.data.generatedImages.length > 0) {
      // Set to last image when new image is added
      setCurrentImageIndex(modelNode.data.generatedImages.length - 1);
      
      // Save images to localStorage for persistence
      const projectId = window.location.search.includes('project=') 
        ? new URLSearchParams(window.location.search).get('project') 
        : 'default';
      if (projectId) {
        localStorage.setItem(`portrait-images-${projectId}`, JSON.stringify(modelNode.data.generatedImages));
      }
    }
  }, [modelNode?.data?.generatedImages?.length]);
  
  // Load images from localStorage on mount
  useEffect(() => {
    const projectId = window.location.search.includes('project=') 
      ? new URLSearchParams(window.location.search).get('project') 
      : 'default';
    
    if (projectId && modelNode) {
      const savedImages = localStorage.getItem(`portrait-images-${projectId}`);
      if (savedImages) {
        try {
          const images = JSON.parse(savedImages);
          if (images.length > 0 && (!modelNode.data.generatedImages || modelNode.data.generatedImages.length === 0)) {
            updateNode(modelNode.id, {
              data: {
                ...modelNode.data,
                generatedImages: images
              }
            });
          }
        } catch (e) {
          console.error('Failed to load saved images:', e);
        }
      }
    }
  }, [modelNode?.id]);

  // Load user products
  useEffect(() => {
    // Setup FASHN API key
    const fashnKey = 'fa-whrqHxdK3cKN-bNe7HfPi8eYpJ3PaULanzj5H';
    localStorage.setItem('fashn_api_key', fashnKey);
    fashnService.setApiKey(fashnKey);
    
    const loadUserProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await productService.getUserProducts();
        setUserProducts(response.products);
        
        // Check if a product ID is passed in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        if (productId) {
          const product = response.products.find(p => p._id === productId);
          if (product) {
            setSelectedProduct(product);
            // Open the fashion tab
            setActiveTab('fashion');
            setShowPanel(true);
            setActiveMenuIndex(createMenuItems(activeTab, setActiveTab).findIndex(item => item.label === 'Fashion'));
          }
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    loadUserProducts();
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPanel && 
          menuRef.current && 
          panelRef.current && 
          !menuRef.current.contains(event.target as Node) && 
          !panelRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);

  // Load UI state from project when it loads
  useEffect(() => {
    if (currentProject?.uiState) {
      const state = currentProject.uiState;
      
      // Restore state from project
      if (state.selectedBodyType) setSelectedBodyType(state.selectedBodyType);
      if (state.fastFashionMode !== undefined) setFastFashionMode(state.fastFashionMode);
      if (state.description) setDescription(state.description);
      if (state.orientation) setOrientation(state.orientation);
      if (state.brightness !== undefined) setBrightness(state.brightness);
      if (state.contrast !== undefined) setContrast(state.contrast);
      if (state.saturation !== undefined) setSaturation(state.saturation);
      if (state.ethnicity) setEthnicity(state.ethnicity);
      if (state.selectedBackground) setSelectedBackground(state.selectedBackground);
      if (state.selectedPose) setSelectedPose(state.selectedPose);
      if (state.selectedClothes) setSelectedClothes(state.selectedClothes);
      if (state.gender) setGender(state.gender);
      
      // Restore selected model
      if (state.selectedModel && !nodes.find(n => n.type === 'cleanModel')) {
        try {
          addNode({
            type: 'cleanModel',
            position: { x: 250, y: 200 },
            data: state.selectedModel
          });
        } catch (error) {
          console.error('Error restoring model:', error);
        }
      }
    }
  }, [currentProject?._id]); // Only run when project ID changes
  
  // Auto-save UI state when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveUIState();
    }, 1000); // Debounce for 1 second
    
    return () => clearTimeout(timer);
  }, [saveUIState]);
  
  // Fetch all user generated images
  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        setIsLoadingGallery(true);
        const response = await imageService.getUserImages({
          limit: 50,
          sortBy: 'createdAt'
        });
        if (response.success) {
          setAllGeneratedImages(response.images);
        }
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
      } finally {
        setIsLoadingGallery(false);
      }
    };
    
    fetchAllImages();
  }, []);
  
  // Add error boundary
  if (!addNode || !updateNode) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Loading editor...</p>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleExport = async () => {
    if (!modelNode) {
      toast.error('Please select a model first');
      return;
    }
    
    if (!description || description.trim() === '') {
      toast.error('Please enter a description');
      return;
    }

    // Build enhanced prompt with selected elements
    let enhancedPrompt = description;
    
    // Add Fast Fashion enhancement FIRST (before other modifiers)
    if (fastFashionMode) {
      const fastFashionPrompt = `wearing minimalist solid color clothing, single uniform color garments, plain fabric without patterns or logos, professional studio fashion photography, clean aesthetic, model pose, high-end editorial style, perfect for AI clothing replacement, smooth fabric texture, well-fitted silhouette, fashion e-commerce ready, ${description}`;
      enhancedPrompt = fastFashionPrompt;
    }
    
    if (selectedBackground) {
      enhancedPrompt += `, ${selectedBackground.tag}`;
    }
    
    if (selectedPose) {
      enhancedPrompt += `, ${selectedPose.tag}`;
    }
    
    if (selectedClothes.length > 0 && !fastFashionMode) {
      const clothesTags = selectedClothes.map(c => c.tag).join(', ');
      enhancedPrompt += `, wearing ${clothesTags}`;
    } else if (selectedProduct && !fastFashionMode) {
      // If a product is selected and not in fast fashion mode, include it in the prompt
      enhancedPrompt += `, wearing ${selectedProduct.name} ${selectedProduct.type}`;
    }
    
    // Add body type to prompt
    const sizeDescriptions = {
      'xs': 'extra small, very thin body type',
      's': 'small, thin body type',
      'm': 'medium build, normal weight',
      'l': 'large build, athletic figure',
      'xl': 'extra large, fuller figure'
    };
    
    if (selectedBodyType && sizeDescriptions[selectedBodyType as keyof typeof sizeDescriptions]) {
      enhancedPrompt += `, ${sizeDescriptions[selectedBodyType as keyof typeof sizeDescriptions]}`;
    }
    if (ethnicity !== 'Random') {
      enhancedPrompt += `, ${ethnicity} ethnicity`;
    }

    // Update the model node with all settings
    updateNode(modelNode.id, {
      data: {
        ...modelNode.data,
        prompt: enhancedPrompt,
        orientation,
        imageSize: orientation,
        adjustments: {
          brightness,
          contrast,
          saturation
        },
        appearance: {
          bodyType: selectedBodyType,
          ethnicity
        },
        styleItems: [
          ...(selectedBackground ? [{ type: 'background', ...selectedBackground }] : []),
          ...(selectedPose ? [{ type: 'pose', ...selectedPose }] : []),
          ...selectedClothes.map(c => ({ type: 'fashion', ...c }))
        ]
      }
    });

    // Trigger generation
    setIsGenerating(true);
    
    try {
      const imageSize = orientation; // Now directly using Fal AI format
      
      const response = await generationService.generateImage({
        prompt: enhancedPrompt,
        imageSize,
        numImages: 1,
        loraUrl: modelNode.data.model?.loraUrl,
        modelData: modelNode.data.model,
        projectId: window.location.search.includes('project=') ? new URLSearchParams(window.location.search).get('project') || undefined : undefined,
        styleItems: [
          ...(selectedBackground ? [{ type: 'background' as const, ...selectedBackground }] : []),
          ...(selectedPose ? [{ type: 'pose' as const, ...selectedPose }] : []),
          ...selectedClothes.map(c => ({ type: 'fashion' as const, ...c }))
        ]
      });
      
      if (response.success && response.images && response.images.length > 0) {
        // Update the model node with generated images
        const currentImages = modelNode.data.generatedImages || [];
        updateNode(modelNode.id, {
          data: {
            ...modelNode.data,
            generatedImages: [...currentImages, ...response.images]
          }
        });
        
        // Save to project if we have a project ID
        const projectId = window.location.search.includes('project=') 
          ? new URLSearchParams(window.location.search).get('project') 
          : null;
          
        if (projectId) {
          try {
            // Get all nodes from the store
            const store = usePipelineStore.getState();
            // Convert PipelineNode to ProjectNode format
            const projectNodes = store.nodes.map((node: any) => ({
              id: node.id,
              type: node.type || 'modelNode',
              position: node.position,
              data: {
                model: node.data?.model || { id: '', name: '', image: '' },
                prompt: node.data?.prompt || '',
                imageSize: node.data?.imageSize || '1:1',
                numImages: node.data?.numImages || 1,
                styleItems: node.data?.styleItems || [],
              },
            }));
            await projectService.autoSaveProject(projectId, {
              nodes: projectNodes,
              edges: store.edges,
              viewport: { x: 0, y: 0, zoom: 1 } // Default viewport
            });
            console.log('Project auto-saved with generated images');
          } catch (error) {
            console.error('Failed to auto-save project:', error);
          }
        }
        
        toast.success('Image generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate image');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearAll = () => {
    // Reset all settings
    setGender('Female');
    setDescription('');
    setOrientation('square_hd');
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setSelectedBodyType('m');
    setEthnicity('Random');
    toast.success('All settings cleared');
  };

  const handleVirtualTryOn = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    if (!modelNode?.data?.generatedImages || modelNode.data.generatedImages.length === 0) {
      toast.error('Please generate a model image first');
      return;
    }

    // Check if API key is configured
    const apiKey = localStorage.getItem('fashn_api_key');
    if (!apiKey) {
      toast.error('Please configure your FASHN API key in settings');
      return;
    }

    setIsGeneratingTryOn(true);
    
    try {
      fashnService.setApiKey(apiKey);
      
      const modelImage = modelNode.data.generatedImages[currentImageIndex];
      
      // Convert product image to base64
      const productImageUrl = selectedProduct.imageUrl.startsWith('http') 
        ? selectedProduct.imageUrl 
        : getImageUrl(selectedProduct.imageUrl);
      
      console.log('Product image URL:', productImageUrl);
      
      // Fetch the image and convert to base64
      const response = await fetch(productImageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch product image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Image blob size:', blob.size, 'Type:', blob.type);
      
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64String = reader.result as string;
          console.log('Base64 string length:', base64String.length);
          console.log('Base64 preview:', base64String.substring(0, 100) + '...');
          resolve(base64String);
        };
        reader.onerror = () => reject(new Error('Failed to read image as base64'));
        reader.readAsDataURL(blob);
      });
      
      const productImageBase64 = await base64Promise;
      
      // Convert model image to base64 as well
      console.log('Model image URL:', modelImage.url);
      const modelResponse = await fetch(modelImage.url);
      if (!modelResponse.ok) {
        throw new Error(`Failed to fetch model image: ${modelResponse.status} ${modelResponse.statusText}`);
      }
      
      const modelBlob = await modelResponse.blob();
      console.log('Model blob size:', modelBlob.size, 'Type:', modelBlob.type);
      
      const modelReader = new FileReader();
      const modelBase64Promise = new Promise<string>((resolve, reject) => {
        modelReader.onloadend = () => {
          const base64String = modelReader.result as string;
          console.log('Model base64 string length:', base64String.length);
          resolve(base64String);
        };
        modelReader.onerror = () => reject(new Error('Failed to read model image as base64'));
        modelReader.readAsDataURL(modelBlob);
      });
      
      const modelImageBase64 = await modelBase64Promise;
      
      // Track generation time
      const startTime = Date.now();
      
      // Generate virtual try-on
      const output = await fashnService.generateVirtualTryOn(
        modelImageBase64,
        productImageBase64,
        selectedProduct.type,
        {
          mode: 'balanced',
          numSamples: 1,
          outputFormat: 'png'
        },
        (status, progress) => {
          console.log(`Virtual try-on ${status}: ${progress}%`);
        }
      );
      
      // Save each image to gallery
      const savedImages = await Promise.all(output.map(async (url) => {
        try {
          const savedImage = await imageService.saveGeneratedImage({
            url,
            prompt: `Virtual try-on: ${selectedProduct.name} on ${modelNode.data.model?.name || 'model'}`,
            model: modelNode.data.model || { id: '', name: '', image: '' },
            styleItems: [
              { type: 'product' as const, name: selectedProduct.name, tag: selectedProduct.type }
            ],
            creditsUsed: 5,
            generationTime: Date.now() - startTime,
            projectId: window.location.search.includes('project=') 
              ? new URLSearchParams(window.location.search).get('project') || undefined 
              : undefined
          });
          return {
            url,
            prompt: `${modelNode.data.prompt} wearing ${selectedProduct.name}`,
            width: 1024,
            height: 1536,
            seed: Math.floor(Math.random() * 1000000),
            _id: savedImage._id
          };
        } catch (error) {
          console.error('Failed to save image to gallery:', error);
          return {
            url,
            prompt: `${modelNode.data.prompt} wearing ${selectedProduct.name}`,
            width: 1024,
            height: 1536,
            seed: Math.floor(Math.random() * 1000000)
          };
        }
      }));
      
      // Add generated images to the model node
      updateNode(modelNode.id, {
        data: {
          ...modelNode.data,
          generatedImages: [...modelNode.data.generatedImages, ...savedImages]
        }
      });
      
      // Increment product usage
      await productService.incrementUsage(selectedProduct._id);
      
      // Save to project if we have a project ID
      const projectId = window.location.search.includes('project=') 
        ? new URLSearchParams(window.location.search).get('project') 
        : null;
        
      if (projectId) {
        try {
          // Get all nodes from the store
          const store = usePipelineStore.getState();
          // Convert PipelineNode to ProjectNode format
          const projectNodes = store.nodes.map((node: any) => ({
            id: node.id,
            type: node.type || 'modelNode',
            position: node.position,
            data: {
              model: node.data?.model || { id: '', name: '', image: '' },
              prompt: node.data?.prompt || '',
              imageSize: node.data?.imageSize || '1:1',
              numImages: node.data?.numImages || 1,
              styleItems: node.data?.styleItems || [],
            },
          }));
          await projectService.autoSaveProject(projectId, {
            nodes: projectNodes,
            edges: store.edges,
            viewport: { x: 0, y: 0, zoom: 1 } // Default viewport
          });
          console.log('Project auto-saved with virtual try-on images');
        } catch (error) {
          console.error('Failed to auto-save project:', error);
        }
      }
      
      toast.success('Virtual try-on generated successfully!');
    } catch (error: any) {
      console.error('Virtual try-on error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      if (error.message.includes('fetch') || error.message.includes('Failed to load')) {
        toast.error('Failed to load images. Please check your connection and try again.');
      } else if (error.message.includes('FASHN API Error:')) {
        // Extract the specific FASHN error message
        toast.error(error.message);
      } else if (error.message.includes('Invalid API key')) {
        toast.error('Invalid FASHN API key. Please check your settings.');
      } else if (error.message.includes('Out of credits')) {
        toast.error('Out of FASHN credits. Please purchase more credits.');
      } else {
        toast.error(error.message || 'Failed to generate virtual try-on');
      }
    } finally {
      setIsGeneratingTryOn(false);
    }
  };

  return (
    <>
      <FashnApiInit />
      <div className="h-full flex">
      {/* Left Vertical Menu Bar */}
      <motion.div 
        ref={menuRef}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20"
      >
        <VerticalMenuBar 
          items={createMenuItems(activeTab, setActiveTab)}
          currentActiveIndex={activeMenuIndex}
          onItemClick={(index, item) => {
            const newTab = item.label.toLowerCase();
            
            // If clicking the same item and panel is open, close it
            if (activeMenuIndex === index && showPanel) {
              setShowPanel(false);
              setActiveMenuIndex(-1);
            } else {
              // Otherwise open/switch to the new panel
              setActiveMenuIndex(index);
              setActiveTab(newTab);
              setShowPanel(true);
            }
          }}
        />
      </motion.div>
      
      {/* Expandable Panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Panel - No animation */}
            <div
              ref={panelRef}
              className="fixed left-24 top-1/2 -translate-y-1/2 w-[380px] h-[90vh] max-h-[800px] bg-card rounded-3xl shadow-2xl z-50 border border-border overflow-hidden"
            >
            <div className="h-full flex flex-col">
              
              {/* Header */}
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground capitalize">{activeTab}s</h3>
              </div>
              
              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'model' && (
                  <div className="p-6">
                    {/* Gender Toggle */}
                    <div className="flex gap-2 mb-6">
                      <button
                        onClick={() => setGender('Female')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                          gender === 'Female' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        Female
                      </button>
                      <button
                        onClick={() => setGender('Male')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                          gender === 'Male' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        Male
                      </button>
                    </div>
                    
                    {/* Size Selector */}
                    <div className="mb-6">
                      <label className="text-sm font-medium text-muted-foreground mb-3 block">Size</label>
                      <div className="flex gap-2 justify-center">
                        {sizes.map((size) => (
                          <button
                            key={size.value}
                            onClick={() => setSelectedBodyType(size.value)}
                            className={`w-12 h-12 rounded-full font-medium text-sm transition-all ${
                              selectedBodyType === size.value
                                ? 'bg-orange-500 text-white shadow-lg scale-110'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Models Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {models.filter(m => m.gender.toLowerCase() === gender.toLowerCase()).map((model) => (
                        <motion.div
                          key={model.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="group cursor-pointer"
                          onClick={() => {
                            if (modelNode) {
                              updateNode(modelNode.id, {
                                data: {
                                  ...modelNode.data,
                                  model: {
                                    id: model.id,
                                    name: model.name,
                                    image: model.photo,
                                    loraUrl: model.loraUrl
                                  }
                                }
                              });
                            } else {
                              addNode({
                                id: `model-${Date.now()}`,
                                type: 'modelNode',
                                position: { x: 300, y: 200 },
                                data: {
                                  model: {
                                    id: model.id,
                                    name: model.name,
                                    image: model.photo,
                                    loraUrl: model.loraUrl
                                  },
                                  prompt: description,
                                  onDelete: () => {},
                                  onUpdate: () => {}
                                }
                              });
                            }
                            setShowPanel(false);
                            // Keep activeMenuIndex to maintain highlight
                            toast.success(`Selected ${model.name}`);
                          }}
                        >
                          <div className="relative overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="aspect-[2/3] relative">
                              <Image
                                src={model.photo}
                                alt={model.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <p className="mt-2 text-center text-sm font-medium text-foreground">
                              {model.name}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'style' && (
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                    {fashionStyles?.map((style: any, index: number) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedClothes([...selectedClothes, style]);
                          toast.success(`Added ${style.name} style`);
                        }}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-lg transition-all duration-300 p-4">
                          <div className="flex flex-col items-center justify-center h-28">
                            <SwatchIcon className="w-8 h-8 text-primary mb-2" />
                            <p className="text-foreground text-sm font-semibold text-center">{style.name}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'background' && (
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                    {backgrounds?.map((bg: any) => (
                      <motion.div
                        key={bg.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedBackground(bg);
                          toast.success(`Selected ${bg.name} background`);
                        }}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-lg transition-all duration-300">
                          <div className="aspect-[4/3] relative">
                            <Image
                              src={bg.image}
                              alt={bg.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <p className="mt-2 text-center text-sm font-medium text-foreground">
                            {bg.name}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'pose' && (
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                    {poses?.map((pose: any) => (
                      <motion.div
                        key={pose.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedPose(pose);
                          toast.success(`Selected ${pose.name} pose`);
                        }}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden rounded-xl bg-muted shadow-sm hover:shadow-lg transition-all duration-300 p-4">
                          <div className="flex flex-col items-center justify-center h-28">
                            <CameraIcon className="w-8 h-8 text-primary mb-2" />
                            <p className="text-foreground text-sm font-semibold text-center">{pose.name}</p>
                            <p className="text-muted-foreground text-xs mt-1">{pose.tag}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'body' && (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select body type for your model
                        </p>
                        {!selectedBodyType && (
                          <p className="text-xs text-primary mb-4 text-center">
                            Please select a body type
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        {sizes.map((size) => (
                          <button
                            key={size.value}
                            onClick={() => setSelectedBodyType(size.value)}
                            className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all transform flex items-center justify-between ${
                              selectedBodyType === size.value
                                ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-[1.01]'
                            }`}
                          >
                            <span>{size.label} - {size.description}</span>
                            {selectedBodyType === size.value && (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground text-center">
                          Body type affects the overall appearance of the model
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'settings' && (
                  <div className="p-6">
                    <div className="space-y-4">
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Orientation</label>
                      <div className="grid grid-cols-2 gap-2">
                        {orientationPresets.map((preset) => (
                          <button
                            key={preset.value}
                            onClick={() => setOrientation(preset.value)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                              orientation === preset.value
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-lg">{preset.icon}</span>
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Brightness</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={brightness}
                          onChange={(e) => setBrightness(Number(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-primary font-semibold w-12 text-right">{brightness}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Contrast</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={contrast}
                          onChange={(e) => setContrast(Number(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-primary font-semibold w-12 text-right">{contrast}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Saturation</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={saturation}
                          onChange={(e) => setSaturation(Number(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-primary font-semibold w-12 text-right">{saturation}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Image Quality</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Standard (Fast)</option>
                        <option>High (Balanced)</option>
                        <option>Ultra (Best Quality)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Batch Size</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="4" 
                        defaultValue="1"
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'advanced' && (
                  <div className="p-6">
                    <div className="space-y-4">
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Custom LoRA URL</label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Negative Prompt</label>
                      <textarea 
                        rows={3}
                        placeholder="What to avoid in the generation..."
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Guidance Scale</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        defaultValue="7.5"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <label className="text-sm font-medium text-foreground">
                            Fast Fashion Mode
                          </label>
                        </div>
                        <button
                          onClick={() => setFastFashionMode(!fastFashionMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                            fastFashionMode ? "bg-purple-600" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                              fastFashionMode ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Generates solid color clothing optimized for AI replacement
                      </p>
                    </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'fashion' && (
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Fashion AI Info */}
                      <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800/30">
                        <h4 className="font-medium text-orange-900 dark:text-orange-200 mb-1 flex items-center gap-2">
                          <SparklesIcon className="w-5 h-5" />
                          Virtual Try-On
                        </h4>
                        <p className="text-sm text-orange-800 dark:text-orange-300">
                          Select a product below to apply it to your generated model using AI
                        </p>
                      </div>
                      
                      {/* Products Grid */}
                      {isLoadingProducts ? (
                        <div className="flex justify-center py-8">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : userProducts.length === 0 ? (
                        <div className="text-center py-8">
                          <Package2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">No products uploaded yet</p>
                          <Link 
                            href="/dashboard/fashion-ai"
                            className="text-sm text-orange-500 hover:text-orange-600 mt-2 inline-block"
                          >
                            Upload your first product →
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            {userProducts.map((product) => (
                              <motion.div
                                key={product._id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                                  selectedProduct?._id === product._id
                                    ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                                    : 'border-border hover:border-orange-300'
                                }`}
                                onClick={() => setSelectedProduct(product)}
                              >
                                <div className="aspect-square relative">
                                  <Image
                                    src={getImageUrl(product.imageUrl)}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                  {selectedProduct?._id === product._id && (
                                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                        <Check className="w-5 h-5 text-orange-500" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium text-sm text-foreground truncate">{product.name}</h4>
                                  <p className="text-xs text-muted-foreground capitalize">{product.type}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Apply Button */}
                          {selectedProduct && (
                            <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              onClick={handleVirtualTryOn}
                              disabled={isGeneratingTryOn || !modelNode?.data?.generatedImages?.length}
                              className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {isGeneratingTryOn ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Generating Try-On...
                                </>
                              ) : (
                                <>
                                  <SparklesIconSolid className="w-5 h-5" />
                                  Apply {selectedProduct.name}
                                </>
                              )}
                            </motion.button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main Canvas Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Top boundary line (invisible) - 20px from top */}
        <div className="absolute top-5 left-0 right-0 h-0 z-[100] pointer-events-none" id="top-boundary" />
        
        {/* Bottom boundary line (invisible) - above the bottom controls */}
        <div className="absolute bottom-[200px] left-0 right-0 h-0 z-[100] pointer-events-none" id="bottom-boundary" />
        
        {/* Center Canvas */}
        <div className="flex-1 relative">
        <div className="absolute top-5 bottom-[200px] left-0 right-0 flex flex-col items-center justify-center px-4">
          {modelNode?.data?.generatedImages && modelNode.data.generatedImages.length > 0 ? (
            <div className="flex flex-col w-full h-full" style={{ maxWidth: '650px' }}>
              {/* Horizontal Control Bar */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-full shadow-lg border border-gray-200/30 dark:border-gray-800/30 flex items-center gap-2"
              >
                {/* Navigation Controls */}
                <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                    disabled={currentImageIndex === 0}
                    className={`p-2 rounded-full transition-all ${
                      currentImageIndex === 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-100 dark:text-gray-400 dark:hover:text-orange-500 dark:hover:bg-orange-900/20'
                    }`}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  
                  <span className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentImageIndex + 1} / {modelNode.data.generatedImages.length}
                  </span>
                  
                  <button
                    onClick={() => setCurrentImageIndex(Math.min(modelNode.data.generatedImages.length - 1, currentImageIndex + 1))}
                    disabled={currentImageIndex === modelNode.data.generatedImages.length - 1}
                    className={`p-2 rounded-full transition-all ${
                      currentImageIndex === modelNode.data.generatedImages.length - 1
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-100 dark:text-gray-400 dark:hover:text-orange-500 dark:hover:bg-orange-900/20'
                    }`}
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-1 flex-1">
                  {/* Favorite Button */}
                  <button
                    onClick={() => {
                      const newFavorites = new Set(favoriteImages);
                      if (newFavorites.has(currentImageIndex)) {
                        newFavorites.delete(currentImageIndex);
                      } else {
                        newFavorites.add(currentImageIndex);
                      }
                      setFavoriteImages(newFavorites);
                    }}
                    className="p-2 rounded-full transition-all text-gray-600 hover:text-red-500 hover:bg-red-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                  >
                    {favoriteImages.has(currentImageIndex) ? (
                      <HeartIconSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Download Button */}
                  <button
                    onClick={() => {
                      const image = modelNode.data.generatedImages[currentImageIndex];
                      const link = document.createElement('a');
                      link.href = image.url;
                      link.download = `fashion-${currentImageIndex + 1}.jpg`;
                      link.click();
                    }}
                    className="p-2 rounded-full transition-all text-gray-600 hover:text-blue-600 hover:bg-blue-100 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      const newImages = [...modelNode.data.generatedImages];
                      newImages.splice(currentImageIndex, 1);
                      updateNode(modelNode.id, {
                        data: {
                          ...modelNode.data,
                          generatedImages: newImages
                        }
                      });
                      setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
                      toast.success('Image deleted');
                    }}
                    className="p-2 rounded-full transition-all text-gray-600 hover:text-red-600 hover:bg-red-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    updateNode(modelNode.id, {
                      data: {
                        ...modelNode.data,
                        generatedImages: []
                      }
                    });
                    setCurrentImageIndex(0);
                  }}
                  className="p-2 rounded-full transition-all text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 ml-auto"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </motion.div>
              
              {/* Image Display */}
              <div className="relative flex-1 overflow-hidden">
                <div 
                  className="absolute inset-0 flex transition-transform duration-500 ease-out gap-8"
                  style={{
                    transform: `translateX(calc(-${currentImageIndex * 100}% - ${currentImageIndex * 2}rem))`
                  }}
                >
                  {modelNode.data.generatedImages.map((image: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={index === modelNode.data.generatedImages.length - 1 ? { opacity: 0, scale: 0.8 } : {}}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex-shrink-0 w-full h-full flex items-center justify-center"
                    >
                      {/* Just the image with subtle glow */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={image.url}
                          alt={`Generated Fashion ${index + 1}`}
                          className="rounded-2xl max-w-full max-h-full w-auto h-auto object-contain"
                          style={{
                            filter: 'drop-shadow(0 0 40px rgba(251, 146, 60, 0.15))'
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Bottom Action Area */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8">
          {/* Selected Items Preview - Above Input */}
          <div className="mb-3 flex items-center justify-center gap-3">
            {selectedModel && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 shadow-md cursor-pointer hover:border-red-500 transition-colors"
                  onClick={() => {
                    if (modelNode) {
                      updateNode(modelNode.id, {
                        data: {
                          ...modelNode.data,
                          model: null
                        }
                      });
                    }
                  }}>
                  <Image
                    src={selectedModel.image}
                    alt={selectedModel.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  {selectedModel.name}
                </div>
              </motion.div>
            )}
            {selectedBackground && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500/30 shadow-md cursor-pointer hover:border-red-500 transition-colors"
                  onClick={() => setSelectedBackground(null)}>
                  <Image
                    src={selectedBackground.image}
                    alt={selectedBackground.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  {selectedBackground.name}
                </div>
              </motion.div>
            )}
            {selectedPose && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group"
              >
                <div className="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-500/30 shadow-md flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors"
                  onClick={() => setSelectedPose(null)}>
                  <CameraIcon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  {selectedPose.name}
                </div>
              </motion.div>
            )}
            {selectedClothes.map((style, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-500/30 shadow-md flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors"
                  onClick={() => {
                    const newClothes = [...selectedClothes];
                    newClothes.splice(idx, 1);
                    setSelectedClothes(newClothes);
                  }}>
                  <SwatchIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  {style.name}
                </div>
              </motion.div>
            ))}
            {/* Body type indicator */}
            {selectedBodyType && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group"
              >
                <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-500/30 shadow-md flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors"
                  onClick={() => setSelectedBodyType('m')}>
                  <span className="text-orange-700 font-bold text-sm">{sizes.find(s => s.value === selectedBodyType)?.label}</span>
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  {sizes.find(s => s.value === selectedBodyType)?.label}
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Animated Input */}
          <div className="relative w-full">
              <PlaceholdersAndVanishInput
                placeholders={[
                  "Describe your fashion model...",
                  "What style are you looking for?",
                  "Add clothing details...",
                  "Describe the pose and mood...",
                  "What's the background setting?"
                ]}
                onChange={(e) => setDescription(e.target.value)}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExport();
                }}
                disabled={isGenerating}
              />
            </div>
          </div>
        </div>
        
        {/* Right Gallery */}
        <div className="w-80 bg-card border-l border-border h-full overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Gallery</h2>
            
            {modelNode?.data?.generatedImages && modelNode.data.generatedImages.length > 0 ? (
              <>
                {/* Newly Generated Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Newly Generated</h3>
                  <div className="space-y-3">
                    {modelNode.data.generatedImages.slice(-2).reverse().map((image: any, index: number) => (
                      <motion.div
                        key={`new-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group cursor-pointer rounded-lg overflow-hidden border border-primary/20"
                        onClick={() => {
                          setSelectedImage(image);
                          setShowImageModal(true);
                        }}
                      >
                        <Image
                          src={image.url}
                          alt={`New ${index + 1}`}
                          width={300}
                          height={400}
                          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white text-sm font-medium line-clamp-2">
                              {modelNode.data.prompt || 'AI Generated'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* All Images Section */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">All Generations</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {modelNode.data.generatedImages.map((image: any, index: number) => (
                      <motion.div
                        key={`all-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => {
                          setSelectedImage(image);
                          setShowImageModal(true);
                        }}
                      >
                        <div className="aspect-[3/4] relative">
                          <Image
                            src={image.url}
                            alt={`Generated ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Hover overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="p-2 bg-white/90 rounded-lg backdrop-blur-sm">
                              <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <SparklesIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No images generated yet</p>
                <p className="text-sm text-muted-foreground mt-2">Start creating your fashion designs!</p>
              </div>
            )}
            
            {/* All User Generated Images */}
            {allGeneratedImages.length > 0 && (
              <div className="mt-8 border-t border-border pt-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">All Your Creations</h3>
                {isLoadingGallery ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {allGeneratedImages.map((image, index) => (
                      <motion.div
                        key={image._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
                        className="relative group cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => {
                          setSelectedImage(image);
                          setShowImageModal(true);
                        }}
                      >
                        <div className="aspect-[3/4] relative">
                          <Image
                            src={image.url}
                            alt={image.prompt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 320px) 150px, 150px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs font-medium line-clamp-2">{image.prompt}</p>
                            <p className="text-xs opacity-70 mt-1">{new Date(image.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowImageModal(false);
              setSelectedImage(null);
            }}
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
                    src={selectedImage.url}
                    alt="Generated fashion"
                    width={selectedImage.width || 640}
                    height={selectedImage.height || 965}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Generation Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Prompt</label>
                        <p className="text-foreground mt-1">{modelNode?.data?.prompt || 'No prompt available'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Model</label>
                          <p className="text-foreground mt-1">{selectedModel?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Orientation</label>
                          <p className="text-foreground mt-1">{orientation}</p>
                        </div>
                      </div>
                      {selectedBodyType && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Body Type</label>
                          <p className="text-foreground mt-1">
                            {sizes.find(s => s.value === selectedBodyType)?.label || selectedBodyType}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Fast Fashion</label>
                          <p className="text-foreground mt-1">{fastFashionMode ? 'Enabled' : 'Disabled'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Gender</label>
                          <p className="text-foreground mt-1">{gender}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border space-y-3">
                    <button 
                      onClick={() => {
                        // Add image to the portrait editor
                        if (selectedImage) {
                          // If no modelNode exists, create one first
                          if (!modelNode) {
                            // Create a default model node
                            const newNodeId = `model-${Date.now()}`;
                            const newNode = {
                              id: newNodeId,
                              type: 'modelNode',
                              position: { x: 250, y: 100 },
                              data: {
                                label: 'Model',
                                type: 'processing' as const,
                                model: null,
                                prompt: '',
                                generatedImages: [selectedImage]
                              }
                            };
                            
                            addNode(newNode);
                            
                            // Save to localStorage
                            const projectId = window.location.search.includes('project=') 
                              ? new URLSearchParams(window.location.search).get('project') 
                              : null;
                            if (projectId) {
                              localStorage.setItem(`portrait-images-${projectId}`, JSON.stringify([selectedImage]));
                            }
                            
                            toast.success('Image added to editor');
                          } else {
                            // Add to existing modelNode
                            const currentImages = modelNode.data.generatedImages || [];
                            // Check if image already exists
                            const exists = currentImages.some((img: any) => img.url === selectedImage.url);
                            if (!exists) {
                              const updatedImages = [...currentImages, selectedImage];
                              updateNode(modelNode.id, {
                                ...modelNode.data,
                                generatedImages: updatedImages
                              });
                              
                              // Save to localStorage
                              const projectId = window.location.search.includes('project=') 
                                ? new URLSearchParams(window.location.search).get('project') 
                                : null;
                              if (projectId) {
                                localStorage.setItem(`portrait-images-${projectId}`, JSON.stringify(updatedImages));
                              }
                              
                              // Save to project
                              if (currentProject && updateProject) {
                                updateProject({
                                  nodes: nodes.map(n => 
                                    n.id === modelNode.id 
                                      ? { ...n, data: { ...n.data, generatedImages: updatedImages } }
                                      : n
                                  )
                                });
                              }
                              
                              toast.success('Image added to your collection');
                            } else {
                              toast('Image already in your collection', { icon: 'ℹ️' });
                            }
                          }
                        }
                        setShowImageModal(false);
                        setSelectedImage(null);
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add to Editor
                    </button>
                    <button 
                      onClick={() => {
                        setShowImageModal(false);
                        setSelectedImage(null);
                      }}
                      className="w-full bg-muted hover:bg-muted/80 text-foreground font-medium px-6 py-3 rounded-xl transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          position: relative;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          position: relative;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: none;
        }
      `}</style>
    </div>
    </>
  );
}