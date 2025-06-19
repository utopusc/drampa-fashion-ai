"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { AuroraText } from "@/components/magicui/aurora-text";
import { FeatureCard4 } from "@/components/ui/feature-card-4";
import { FooterSection } from "@/components/sections/footer-section";
import { HeroSection } from "@/components/sections/hero-section";

export default function Home() {
  const features = [
    {
      title: "Ever-growing model portfolio",
      description: "Our unique selection of AI generated models for fashion includes diverse body types, ethnicities, and ages.",
      image: "/assets/features/675f0118f796b5690d5ffb09_Botika_AIGeneratedFashionModels_Feature_ModelPortfolio.avif"
    },
    {
      title: "Flat-lay to on-model",
      description: "Turn your packshot images into stunning on-model photos. No photoshoot required.",
      image: "/assets/features/675f01181b6bcbf650a4c6e2_Botika_AIGeneratedFashionModels_Feature_FlatLayProcess.avif"
    },
    {
      title: "Swap backgrounds",
      description: "Enhance basic photos or create stunning lifestyle images with just one click.",
      image: "/assets/features/675f01184314f55d5e8e295e_Botika_AIGeneratedFashionModels_Feature_BackgroundSelection.avif"
    },
    {
      title: "Enhance cropped photos",
      description: "Our solution easily integrates AI fashion models into your cropped images.",
      image: "/assets/features/675f0118a93179f4bcbb0c71_Botika_AIGeneratedFashionModels_Feature_EnhanceCroppedPhotos.avif"
    },
    {
      title: "Perfect your photos",
      description: "Get flawless photos with Botika's AI-powered touch-ups. Quick and simple for flawless results.",
      image: "/assets/features/675f0118594137306534d368_Botika_AIGeneratedFashionModels_PerfectYourProductPhotos.avif"
    },
    {
      title: "Share everywhere",
      description: "Easily connect and export content to your website, social media accounts, and more.",
      image: "/assets/features/675f01183a136e7b24eccc50_Botika_AIGeneratedFashionModels_Feature_SocialMediaPosts.avif"
    }
  ];

  // Orange theme colors for Aurora effect
  const orangeAuroraColors = ["#FF7722", "#FF9933", "#FFB366", "#FFC999"];

  return (
    <main className="flex flex-col items-center justify-center w-full">
      <HeroSection />
      
      {/* Dashboard Content */}
      <div className="w-full bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">


          {/* Features Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-foreground text-center mb-6">
              <AuroraText colors={orangeAuroraColors} speed={0.6}>
                AI solutions
              </AuroraText>{" "}
              to boost your fashion brand
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto font-medium">
              Discover powerful AI tools designed to elevate your fashion brand with professional-quality images
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/20 group"
                >
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="flex items-center justify-center h-full text-muted-foreground">Image</div>';
                        }
                      }}
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Model Gallery Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Meet Our{" "}
                <AuroraText colors={orangeAuroraColors} speed={0.6}>
                  AI Models
                </AuroraText>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
                Interact with our diverse collection of AI fashion models designed to bring your products to life
              </p>
            </div>
            
            <div className="flex justify-center">
              <FeatureCard4 />
            </div>
          </motion.div>

          {/* Get Started Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-12 md:p-16">
              <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Ready to{" "}
                <AuroraText colors={orangeAuroraColors} speed={0.7}>
                  Get Started
                </AuroraText>
                ?
              </h3>
              <p className="text-muted-foreground mb-10 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
                Upload your product photos and let our AI create stunning on-model images with professional backgrounds.
              </p>
              <Link href="/create">
                <motion.button
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold px-12 py-5 rounded-2xl transition-all shadow-lg hover:shadow-xl text-lg md:text-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AuroraText colors={["#FFFFFF", "#FFF5F0", "#FFFFFF", "#FFE5D9"]} speed={1.2}>
                    Create Your First Project
                  </AuroraText>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      <FooterSection />
    </main>
  );
}
