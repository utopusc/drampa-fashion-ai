"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import { ChevronRightIcon, ChevronLeftIcon, PhotoIcon, UserGroupIcon, CameraIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";

interface UploadedProduct {
  id: string;
  file: File;
  preview: string;
  name: string;
}

interface SelectedModel {
  id: string;
  name: string;
  category: "women" | "men";
  image: string;
}

interface SelectedBackground {
  id: string;
  name: string;
  image: string;
  style: string;
}

const OnModelCreate = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedProducts, setUploadedProducts] = useState<UploadedProduct[]>([]);
  const [selectedModels, setSelectedModels] = useState<SelectedModel[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<SelectedBackground | null>(null);
  const [modelCategory, setModelCategory] = useState<"women" | "men">("women");

  const steps = [
    { id: "products", label: "Select Products", icon: PhotoIcon },
    { id: "models", label: "Select Models", icon: UserGroupIcon },
    { id: "background", label: "Select Background", icon: CameraIcon },
    { id: "summary", label: "Summary", icon: SparklesIcon },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return uploadedProducts.length > 0;
      case 1: return selectedModels.length > 0;
      case 2: return true; // Background is optional - null means keep original
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Create On-Model Photos</h1>
          <p className="text-lg text-muted-foreground">
            Transform your products with AI-generated fashion models in 4 simple steps
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-3 ${isActive ? 'text-foreground' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isActive ? 'bg-foreground text-background border-foreground' :
                      isCompleted ? 'bg-green-600 text-white border-green-600' :
                      'bg-background text-muted-foreground border-border'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-medium">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRightIcon className="w-5 h-5 text-muted-foreground mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 mb-8">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <ProductUploadStep 
                key="products"
                uploadedProducts={uploadedProducts}
                setUploadedProducts={setUploadedProducts}
              />
            )}
            {currentStep === 1 && (
              <ModelSelectionStep 
                key="models"
                selectedModels={selectedModels}
                setSelectedModels={setSelectedModels}
                modelCategory={modelCategory}
                setModelCategory={setModelCategory}
              />
            )}
            {currentStep === 2 && (
              <BackgroundSelectionStep 
                key="background"
                selectedBackground={selectedBackground}
                setSelectedBackground={setSelectedBackground}
              />
            )}
            {currentStep === 3 && (
              <SummaryStep 
                key="summary"
                uploadedProducts={uploadedProducts}
                selectedModels={selectedModels}
                selectedBackground={selectedBackground}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors ${
              currentStep === 0 
                ? 'border-border text-muted-foreground cursor-not-allowed' 
                : 'border-border text-foreground hover:bg-muted'
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-4">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-lg transition-colors ${
                  canProceed()
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <span>Next Step</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  // Generate functionality will be implemented later
                  alert("Generate functionality will be implemented with API integration");
                }}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-lg transition-colors ${
                  canProceed()
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Generate Photos</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Upload Step Component
interface ProductUploadStepProps {
  uploadedProducts: UploadedProduct[];
  setUploadedProducts: (products: UploadedProduct[]) => void;
}

const ProductUploadStep = ({ uploadedProducts, setUploadedProducts }: ProductUploadStepProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newProducts = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setUploadedProducts([...uploadedProducts, ...newProducts]);
  }, [uploadedProducts, setUploadedProducts]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true
  });

  const removeProduct = (id: string) => {
    setUploadedProducts(uploadedProducts.filter(p => p.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Upload Your Product Images</h2>
        <p className="text-muted-foreground">
          Drag and drop your product images here, or click to browse
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          PNG, JPG, WebP or HEIC
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-foreground bg-muted/50' : 'border-border hover:border-muted-foreground'
        }`}
      >
        <input {...getInputProps()} />
        <PhotoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-lg text-muted-foreground">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg text-muted-foreground mb-2">Drag and drop images here</p>
            <button className="bg-foreground text-background px-6 py-2 rounded-lg hover:bg-foreground/90 transition-colors">
              Upload a new image
            </button>
          </div>
        )}
      </div>

      {/* Uploaded Products */}
      {uploadedProducts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upload Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedProducts.map((product) => (
              <div key={product.id} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={product.preview}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <p className="text-sm text-muted-foreground mt-2 truncate">{product.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Model Selection Step Component
interface ModelSelectionStepProps {
  selectedModels: SelectedModel[];
  setSelectedModels: (models: SelectedModel[]) => void;
  modelCategory: "women" | "men";
  setModelCategory: (category: "women" | "men") => void;
}

const ModelSelectionStep = ({ 
  selectedModels, 
  setSelectedModels, 
  modelCategory, 
  setModelCategory 
}: ModelSelectionStepProps) => {
  // All women models from assets folder
  const womenModels = [
    { id: "1", name: "Zoe", category: "women" as const, image: "/assets/models/women/zoe-JVxMIHn4.webp" },
    { id: "2", name: "Sophia", category: "women" as const, image: "/assets/models/women/sophia-tdiGXw.webp" },
    { id: "3", name: "Talia", category: "women" as const, image: "/assets/models/women/talia-RdX5jk61.webp" },
    { id: "4", name: "Nyah", category: "women" as const, image: "/assets/models/women/nyah-Ljt-PQOR.webp" },
    { id: "5", name: "Noelle", category: "women" as const, image: "/assets/models/women/noelle-gxyVzUP4.webp" },
    { id: "6", name: "Kylie", category: "women" as const, image: "/assets/models/women/kylie-BuljE690.webp" },
    { id: "7", name: "Liv", category: "women" as const, image: "/assets/models/women/liv-wiamag.webp" },
    { id: "8", name: "Luca", category: "women" as const, image: "/assets/models/women/luca-J5qTzz7O.webp" },
    { id: "9", name: "Mia", category: "women" as const, image: "/assets/models/women/mia-5fIrACeF.webp" },
    { id: "10", name: "Ivy", category: "women" as const, image: "/assets/models/women/ivy-tHcN-Fsd.webp" },
    { id: "11", name: "Gloria", category: "women" as const, image: "/assets/models/women/gloria-wXOo7YIx.webp" },
    { id: "12", name: "Devon", category: "women" as const, image: "/assets/models/women/devon-x1v5Lnsg.webp" },
    { id: "13", name: "Denise", category: "women" as const, image: "/assets/models/women/denise-Sai3l_VP.webp" },
    { id: "14", name: "Aria", category: "women" as const, image: "/assets/models/women/aria-165-Wg.webp" },
    { id: "15", name: "Anaya", category: "women" as const, image: "/assets/models/women/anaya-eK_Qkw.webp" },
    { id: "16", name: "Chloe", category: "women" as const, image: "/assets/models/women/chloe-71yIXLLq.webp" },
  ];

  // All men models from assets folder  
  const menModels = [
    { id: "17", name: "Marco", category: "men" as const, image: "/assets/models/Men/marco-TAa_B3zm.webp" },
    { id: "18", name: "Nico", category: "men" as const, image: "/assets/models/Men/nico-lKWc_bcq.webp" },
    { id: "19", name: "River", category: "men" as const, image: "/assets/models/Men/river-psNzQEug.webp" },
    { id: "20", name: "Julian", category: "men" as const, image: "/assets/models/Men/julian-lHqmviLF.webp" },
    { id: "21", name: "Leo", category: "men" as const, image: "/assets/models/Men/leo-G44hGlmA.webp" },
    { id: "22", name: "Bran", category: "men" as const, image: "/assets/models/Men/bran-lFG6mV7Y.webp" },
  ];

  const currentModels = modelCategory === "women" ? womenModels : menModels;

  const toggleModel = (model: SelectedModel) => {
    const isSelected = selectedModels.find(m => m.id === model.id);
    if (isSelected) {
      setSelectedModels(selectedModels.filter(m => m.id !== model.id));
    } else {
      if (selectedModels.length < 4) {
        setSelectedModels([...selectedModels, model]);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Models Gallery</h2>
        <p className="text-muted-foreground mb-4">
          Select up to 4 models - all products will be created using each selected model
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-muted p-1 rounded-lg flex">
          <button
            onClick={() => setModelCategory("women")}
            className={`px-6 py-2 rounded-md transition-colors ${
              modelCategory === "women" 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Women
          </button>
          <button
            onClick={() => setModelCategory("men")}
            className={`px-6 py-2 rounded-md transition-colors ${
              modelCategory === "men" 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Men
          </button>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {currentModels.map((model) => {
          const isSelected = selectedModels.find(m => m.id === model.id);
          return (
            <div
              key={model.id}
              onClick={() => toggleModel(model)}
              className={`relative cursor-pointer rounded-xl overflow-hidden transition-all ${
                isSelected ? 'ring-2 ring-foreground' : 'hover:scale-105'
              }`}
            >
              <div className="aspect-[3/4] bg-muted">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
                  ✓
                </div>
              )}
              <div className="p-3 bg-card">
                <h3 className="font-semibold text-foreground text-center">{model.name}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {selectedModels.length > 0 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Selected {selectedModels.length} of 4 models: {selectedModels.map(m => m.name).join(", ")}
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Background Selection Step Component
interface BackgroundSelectionStepProps {
  selectedBackground: SelectedBackground | null;
  setSelectedBackground: (background: SelectedBackground | null) => void;
}

const BackgroundSelectionStep = ({ selectedBackground, setSelectedBackground }: BackgroundSelectionStepProps) => {
  // All backgrounds from assets folder with corrected names based on actual images
  const backgrounds = [
    { id: "1", name: "Studio", image: "/assets/Background/cgyWPfvxZ9kNifnnGhavBg.jpg", style: "STUDIO" },
    { id: "2", name: "Stucco Wall", image: "/assets/Background/DtUArmWGBNNN3Nxw4dTpjg.jpg", style: "STUCCO WALL" },
    { id: "3", name: "Hardwood Floor Studio", image: "/assets/Background/FsrfirAEl6Kst3kJHY5a-5PGdoQ.webp", style: "HARDWOOD FLOOR STUDIO" },
    { id: "4", name: "Studio Caramel", image: "/assets/Background/JywHHfoXEbQjGI-d0g9mGw.jpg", style: "STUDIO CARAMEL" },
    { id: "5", name: "Subtle Serenity", image: "/assets/Background/kd9atBaYbIPevJpgooRmSw.jpg", style: "SUBTLE SERENITY" },
    { id: "6", name: "Valentine's Day", image: "/assets/Background/lrcG4NRC8fb2lr_Bmt6roQ.jpg", style: "VALENTINE'S DAY" },
    { id: "7", name: "Concrete Chic", image: "/assets/Background/mvz2JwSamW3dV3l2q5zu3g.jpg", style: "CONCRETE CHIC" },
    { id: "8", name: "Skylight Hues", image: "/assets/Background/pZpxLA1oSZdKBh3Da082-A.jpg", style: "SKYLIGHT HUES" },
    { id: "9", name: "Lofty Look", image: "/assets/Background/Qi-6ZSTwimRVEPKP6mXoDQ.jpg", style: "LOFTY LOOK" },
    { id: "10", name: "Light Studio", image: "/assets/Background/TZLeFGIsiWmT06iAV6Ezmw.jpg", style: "LIGHT STUDIO" },
    { id: "11", name: "Rustic Bloom", image: "/assets/Background/UiW4QAVpv-F7HJFQ4lVuGQ.jpg", style: "RUSTIC BLOOM" },
    { id: "12", name: "Warm Studio", image: "/assets/Background/uW8ENngeg8dPNppkOaCpPA.jpg", style: "WARM STUDIO" },
    { id: "13", name: "Neutral Beige", image: "/assets/Background/V4UAr-HDmTIjE3giPt9Zfw.jpg", style: "NEUTRAL BEIGE" },
    { id: "14", name: "Professional Studio", image: "/assets/Background/V5lLSUAwkXjjiIoJOCg4jA.jpg", style: "PROFESSIONAL STUDIO" },
    { id: "15", name: "Modern White", image: "/assets/Background/WJETrlSMcMSNe5Rp21o8ow.jpg", style: "MODERN WHITE" },
    { id: "16", name: "Elegant Gray", image: "/assets/Background/zg1Uvzc98K55fs0mMb3Gxw.jpg", style: "ELEGANT GRAY" },
    { id: "17", name: "Scarlet Luxe", image: "/assets/Background/scarlet-luxe-mX8s-w.webp", style: "SCARLET LUXE" },
    { id: "18", name: "Christmas Glitter", image: "/assets/Background/xmas-glitter-CdcMqg.webp", style: "CHRISTMAS GLITTER" },
    { id: "19", name: "Vibrant Orange", image: "/assets/Background/2UwyTVtBAtwo59EvFAPnqw.jpg", style: "VIBRANT ORANGE" },
    { id: "20", name: "Soft Blue", image: "/assets/Background/5kcdb-FfxjKv0dR_MYcqFA.jpg", style: "SOFT BLUE" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Select Background</h2>
        <p className="text-muted-foreground">
          Choose the perfect background for your product visualization
        </p>
      </div>

      {/* Keep Original Background Option */}
      <div className="mb-8">
        <div
          onClick={() => setSelectedBackground(null)}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            selectedBackground === null ? 'border-foreground bg-muted/50' : 'border-border hover:border-muted-foreground'
          }`}
        >
          <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
            <PhotoIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Keep original background</h3>
          {selectedBackground === null && (
            <div className="inline-flex items-center space-x-1 text-foreground">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Background Gallery with 400x650 aspect ratio */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {backgrounds.map((background) => {
          const isSelected = selectedBackground?.id === background.id;
          return (
            <div
              key={background.id}
              onClick={() => setSelectedBackground(background)}
              className={`relative cursor-pointer rounded-xl overflow-hidden transition-all ${
                isSelected ? 'ring-2 ring-foreground' : 'hover:scale-105'
              }`}
            >
              <div className="aspect-[400/650] bg-muted relative">
                <img
                  src={background.image}
                  alt={background.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3">
                  <p className="text-xs font-medium text-white">Create in the style of</p>
                  <p className="text-sm font-bold text-white">{background.style}</p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Summary Step Component
interface SummaryStepProps {
  uploadedProducts: UploadedProduct[];
  selectedModels: SelectedModel[];
  selectedBackground: SelectedBackground | null;
}

const SummaryStep = ({ uploadedProducts, selectedModels, selectedBackground }: SummaryStepProps) => {
  const totalGenerations = uploadedProducts.length * selectedModels.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Summary</h2>
        <p className="text-muted-foreground">
          Review your selections before generating {totalGenerations} new images
        </p>
      </div>

      <div className="space-y-8">
        {/* Products Summary */}
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Products ({uploadedProducts.length})</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {uploadedProducts.map((product) => (
              <div key={product.id} className="aspect-square bg-background rounded-lg overflow-hidden">
                <img
                  src={product.preview}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Models Summary */}
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Models ({selectedModels.length})</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {selectedModels.map((model) => (
              <div key={model.id} className="text-center">
                <div className="aspect-[3/4] bg-background rounded-lg overflow-hidden mb-2">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{model.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Background Summary */}
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Background</h3>
          {selectedBackground ? (
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-background rounded-lg overflow-hidden">
                <img
                  src={selectedBackground.image}
                  alt={selectedBackground.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedBackground.style}</p>
                <p className="text-sm text-muted-foreground">Custom background style</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-background rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Original Background</p>
                <p className="text-sm text-muted-foreground">Keep the original product background</p>
              </div>
            </div>
          )}
        </div>

        {/* Generation Summary */}
        <div className="bg-foreground text-background rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Generate</h3>
            <p className="text-background/70 mb-4">
              {totalGenerations} new images will be created using AI
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div>
                <p className="text-background/70">Products</p>
                <p className="font-semibold">{uploadedProducts.length}</p>
              </div>
              <div className="text-background/70">×</div>
              <div>
                <p className="text-background/70">Models</p>
                <p className="font-semibold">{selectedModels.length}</p>
              </div>
              <div className="text-background/70">=</div>
              <div>
                <p className="text-background/70">Total Images</p>
                <p className="font-semibold">{totalGenerations}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OnModelCreate; 