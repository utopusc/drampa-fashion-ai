"use client";

import { motion } from "framer-motion";
import { User, ArrowLeft, Upload, Zap } from "lucide-react";
import Link from "next/link";

export default function MannequinPage() {
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
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <User className="h-8 w-8 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Mannequin Photos
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-500 text-white">
              <Zap className="h-4 w-4" />
              Beta
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Professional mannequin photography for your clothing line. 
            Perfect for showcasing fit, form, and product details with consistent presentation.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800"
        >
          <div className="text-center">
            <Upload className="h-16 w-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Upload Your Product
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload your clothing item to create professional mannequin photography
            </p>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-purple-500 rounded-xl p-12 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drag & drop your product image here
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  or click to browse files
                </p>
                <button className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors">
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
          className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-purple-900 dark:text-purple-100">Beta Feature</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                This feature is currently in beta. We're working on expanding mannequin options and improving fit accuracy.
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
              icon: "👔",
              title: "Perfect Fit",
              description: "AI ensures clothing fits naturally on mannequin forms"
            },
            {
              icon: "🎭",
              title: "Multiple Poses", 
              description: "Choose from various mannequin poses and angles"
            },
            {
              icon: "📐",
              title: "Consistent Scale",
              description: "Uniform presentation across your entire product catalog"
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