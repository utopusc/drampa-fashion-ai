"use client";

import { motion } from "framer-motion";
import { Shirt, ArrowLeft, Upload, Zap } from "lucide-react";
import Link from "next/link";

export default function FlatLayPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF7722] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Shirt className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Flat-Lay Photos
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
              <Zap className="h-4 w-4" />
              Beta
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Perfect flat-lay product photography with professional styling. 
            Create beautiful overhead shots of your products with AI-enhanced backgrounds.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800"
        >
          <div className="text-center">
            <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Upload Your Product
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload your product image to create professional flat-lay photography
            </p>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-blue-500 rounded-xl p-12 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drag & drop your product image here
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  or click to browse files
                </p>
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  Choose File
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Supported formats: JPG, PNG, WEBP • Max file size: 10MB
            </div>
          </div>
        </motion.div>

        {/* Beta Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Beta Feature</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                This feature is currently in beta. We're continuously improving the quality and adding new styling options.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: "📸",
              title: "Professional Layouts",
              description: "AI-generated flat-lay arrangements with perfect composition"
            },
            {
              icon: "🎨",
              title: "Custom Backgrounds", 
              description: "Choose from minimalist to artistic background styles"
            },
            {
              icon: "✨",
              title: "Enhanced Details",
              description: "AI enhancement for product details and texture clarity"
            }
          ].map((feature, idx) => (
            <div key={idx} className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 