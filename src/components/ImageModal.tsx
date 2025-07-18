'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt?: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, imageAlt = 'Generated image' }: ImageModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative max-w-[90vw] max-h-[90vh] pointer-events-auto">
              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute -top-12 right-0 flex gap-2"
              >
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  href={imageUrl}
                  download
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  title="Close (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
              
              {/* Image */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative rounded-xl overflow-hidden shadow-2xl bg-black/50"
              >
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-auto h-auto max-w-[90vw] max-h-[85vh] object-contain"
                  style={{ display: 'block' }}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}