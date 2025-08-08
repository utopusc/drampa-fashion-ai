"use client";

import { useEffect } from 'react';
import fashnService from '@/services/fashnService';

export default function FashnKeyManager() {
  useEffect(() => {
    const setupFashnKey = async () => {
      // Check if key already exists in localStorage
      const existingKey = localStorage.getItem('fashn_api_key');
      if (existingKey) {
        fashnService.setApiKey(existingKey);
        return;
      }

      // If not, fetch from environment
      try {
        const response = await fetch('/api/save-fashn-key');
        const data = await response.json();
        
        if (data.apiKey) {
          localStorage.setItem('fashn_api_key', data.apiKey);
          fashnService.setApiKey(data.apiKey);
          console.log('FASHN API key loaded from environment');
        }
      } catch (error) {
        console.error('Failed to load FASHN API key:', error);
      }
    };

    setupFashnKey();
  }, []);

  return null;
}