"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { SparklesIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath: string; // 'sign-in' or 'sign-up'
}

export default function UserTypeModal({ isOpen, onClose, redirectPath }: UserTypeModalProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelection = (type: 'creator' | 'business') => {
    setSelectedType(type);
    setTimeout(() => {
      router.push(`/auth/${redirectPath}?type=${type}`);
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-background rounded-3xl p-8 md:p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                  Choose Your Path
                </h2>
                <p className="text-lg text-muted-foreground">
                  Select how you want to use DRAMPA
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Creator Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelection('creator')}
                  className={`relative group p-8 rounded-2xl border-2 transition-all ${
                    selectedType === 'creator' 
                      ? 'border-orange-500 bg-orange-500/10' 
                      : 'border-border hover:border-orange-500/50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                      <SparklesIcon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      I&apos;m a Creator
                    </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      Monetize your likeness as an AI model
                    </p>
                    
                    <ul className="text-left space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span>Upload your photos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span>Earn from every usage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span>Connect with brands</span>
                      </li>
                    </ul>
                  </div>
                </motion.button>

                {/* Business Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelection('business')}
                  className={`relative group p-8 rounded-2xl border-2 transition-all ${
                    selectedType === 'business' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                      <BuildingOfficeIcon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      I&apos;m a Business
                    </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      Create professional product photos
                    </p>
                    
                    <ul className="text-left space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Access AI models</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Generate product photos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Team collaboration</span>
                      </li>
                    </ul>
                  </div>
                </motion.button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="mt-8 w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}