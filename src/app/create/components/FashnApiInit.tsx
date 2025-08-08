"use client";

import { useEffect } from 'react';
import fashnService from '@/services/fashnService';

const DEFAULT_FASHN_API_KEY = 'fa-whrqHxdK3cKN-bNe7HfPi8eYpJ3PaULanzj5H';

export default function FashnApiInit() {
  useEffect(() => {
    // Check if user has a custom API key
    const savedKey = localStorage.getItem('fashn_api_key');
    
    if (!savedKey) {
      // Set default API key
      localStorage.setItem('fashn_api_key', DEFAULT_FASHN_API_KEY);
      fashnService.setApiKey(DEFAULT_FASHN_API_KEY);
      console.log('FASHN API initialized with default key');
    } else {
      // Use saved key
      fashnService.setApiKey(savedKey);
      console.log('FASHN API initialized with saved key');
    }
  }, []);
  
  return null;
}