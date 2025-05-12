"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [showUploadNotice, setShowUploadNotice] = useState(false);
  
  // This is a client component, so we need to use useEffect to access browser APIs
  useEffect(() => {
    // Check if we came from the file upload in the hero section
    if (typeof window !== 'undefined') {
      const fromUpload = sessionStorage.getItem('productImageUploaded');
      if (fromUpload) {
        setShowUploadNotice(true);
        // Clear the flag after showing the notice
        sessionStorage.removeItem('productImageUploaded');
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      {showUploadNotice && (
        <div className="bg-[#FFF0E6] border border-[#FF7722]/20 text-[#FF7722] p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium">Product image uploaded successfully! You can now visualize it on your models.</p>
          </div>
          <button 
            onClick={() => setShowUploadNotice(false)}
            className="text-[#FF7722] hover:text-[#E65100]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to DRAMPA. Create models, upload products, and visualize your fashion designs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#331400]/20 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Models</h2>
            <div className="w-10 h-10 rounded-full bg-[#FFF0E6] dark:bg-[#331400]/40 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#FF7722]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Create custom AI models with your specifications.
          </p>
          <Button asChild className="w-full bg-[#FF7722] hover:bg-[#E65100]">
            <Link href="/dashboard/models/create">Create New Model</Link>
          </Button>
        </div>
        
        <div className="bg-white dark:bg-[#331400]/20 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="w-10 h-10 rounded-full bg-[#FFF0E6] dark:bg-[#331400]/40 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#FF7722]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload your fashion products to visualize on models.
          </p>
          <Button asChild className="w-full bg-[#FF7722] hover:bg-[#E65100]">
            <Link href="/dashboard/products/create">Upload Product</Link>
          </Button>
        </div>
        
        <div className="bg-white dark:bg-[#331400]/20 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Collections</h2>
            <div className="w-10 h-10 rounded-full bg-[#FFF0E6] dark:bg-[#331400]/40 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-[#FF7722]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Organize your designs into collections to share with others.
          </p>
          <Button asChild className="w-full bg-[#FF7722] hover:bg-[#E65100]">
            <Link href="/dashboard/collections/create">Create Collection</Link>
          </Button>
        </div>
      </div>
      
      <div className="bg-[#FFF0E6]/50 dark:bg-[#331400]/10 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#331400]/20 rounded-lg p-4 flex items-start gap-3">
            <div className="rounded-full w-8 h-8 bg-[#FF7722] flex items-center justify-center text-white font-medium">1</div>
            <div>
              <p className="text-sm font-medium">Create a custom virtual model</p>
              <p className="text-xs text-muted-foreground mt-1">Design your model with desired specifications</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#331400]/20 rounded-lg p-4 flex items-start gap-3">
            <div className="rounded-full w-8 h-8 bg-[#FF7722] flex items-center justify-center text-white font-medium">2</div>
            <div>
              <p className="text-sm font-medium">Upload your fashion products</p>
              <p className="text-xs text-muted-foreground mt-1">Add clothing, accessories, and more</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#331400]/20 rounded-lg p-4 flex items-start gap-3">
            <div className="rounded-full w-8 h-8 bg-[#FF7722] flex items-center justify-center text-white font-medium">3</div>
            <div>
              <p className="text-sm font-medium">Visualize products on models</p>
              <p className="text-xs text-muted-foreground mt-1">See how your products look on virtual models</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#331400]/20 rounded-lg p-4 flex items-start gap-3">
            <div className="rounded-full w-8 h-8 bg-[#FF7722] flex items-center justify-center text-white font-medium">4</div>
            <div>
              <p className="text-sm font-medium">Save to collections</p>
              <p className="text-xs text-muted-foreground mt-1">Organize designs for easy sharing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 