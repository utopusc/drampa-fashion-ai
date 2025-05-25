"use client";

import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { DotPattern } from "@/components/ui/dot-pattern";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogIn } from "lucide-react";

export function HeroSection() {
  const { hero } = siteConfig;
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleFileUpload = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleContinue = () => {
    if (files.length > 0) {
      setIsLoading(true);
      // Set session storage flag to indicate we're coming from the file upload
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('productImageUploaded', 'true');
      }
      
      // Simulate processing
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  const AuthRequiredUpload = () => (
    <div className="relative bg-card/50 dark:bg-card/30 rounded-xl p-8 border border-border shadow-sm backdrop-blur-sm text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">AI Fashion Transformation</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Transform your product images with AI-powered virtual fashion models. Sign in to get started with your fashion visualization journey.
        </p>
      </div>
      
      <div className="space-y-3">
        <Link
          href="/auth/sign-up"
          className="bg-primary h-12 flex items-center justify-center text-sm font-medium tracking-wide rounded-lg text-primary-foreground px-6 shadow-md border border-primary/10 hover:bg-primary/90 transition-all ease-out w-full"
        >
          <User className="w-4 h-4 mr-2" />
          Create Free Account
        </Link>
        
        <Link
          href="/auth/sign-in"
          className="h-12 flex items-center justify-center px-6 text-sm font-medium tracking-wide text-primary rounded-lg transition-all ease-out bg-secondary/30 dark:bg-secondary/20 border border-secondary-foreground/10 hover:bg-secondary/50 dark:hover:bg-secondary/30 w-full"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Link>
        
        <p className="text-xs text-muted-foreground mt-4">
          Join thousands of fashion designers creating stunning visualizations
        </p>
      </div>
    </div>
  );

  const FileUploadComponent = () => (
    <div className="relative bg-card/50 dark:bg-card/30 rounded-xl p-6 border border-border shadow-sm backdrop-blur-sm">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">Magic Fashion Transformation</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mt-1">Drop your product image and watch AI create fashion models wearing it</p>
      </div>
      
      <div className="relative transform transition-all">
        <FileUpload onChange={handleFileUpload} />
        
        <div className="mt-6 text-center">
          <Button 
            onClick={handleContinue}
            disabled={files.length === 0 || isLoading}
            className="bg-primary h-10 text-sm font-medium rounded-lg text-primary-foreground px-6 shadow-md border border-primary/10 hover:bg-primary/90 transition-all ease-out w-full max-w-xs mx-auto"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Transform & Visualize"
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3 max-w-xs mx-auto">
            By uploading your image, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section id="hero" className="w-full relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24 bg-background">
      <div className="absolute inset-0 -z-10">
        <DotPattern 
          width={40}
          height={40}
          cr={4}
          glow={false}
          className="opacity-80"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column: Hero Content */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="inline-flex h-8 items-center gap-2 rounded-full bg-secondary/30 dark:bg-secondary/20 border border-secondary-foreground/10 px-3 text-sm font-medium text-primary">
                {hero.badgeIcon}
                {hero.badge}
              </p>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {hero.title}
              </h1>
              <p className="text-base text-muted-foreground font-normal leading-relaxed max-w-md">
                {hero.description}
              </p>
              
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href={user ? "/dashboard" : "/auth/sign-up"}
                  className="bg-primary h-10 flex items-center justify-center text-sm font-medium tracking-wide rounded-lg text-primary-foreground px-5 shadow-md border border-primary/10 hover:bg-primary/90 transition-all ease-out"
                >
                  {user ? "Go to Dashboard" : hero.cta.primary.text}
                </Link>
                <Link
                  href={hero.cta.secondary.href}
                  className="h-10 flex items-center justify-center px-5 text-sm font-medium tracking-wide text-primary rounded-lg transition-all ease-out bg-secondary/30 dark:bg-secondary/20 border border-secondary-foreground/10 hover:bg-secondary/50 dark:hover:bg-secondary/30"
                >
                  {hero.cta.secondary.text}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right Column: Conditional Upload Component */}
          {user ? <FileUploadComponent /> : <AuthRequiredUpload />}
        </div>
      </div>
    </section>
  );
}
