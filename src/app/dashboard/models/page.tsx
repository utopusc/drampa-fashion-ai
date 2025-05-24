"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search-bar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Model } from "@/types";
import { useModelStore } from "@/store/modelStore";

export default function ModelsPage() {
  const { models, loading, error, setModels, setLoading, setError } = useModelStore();
  const [isClient, setIsClient] = useState(false);
  const [promptQuery, setPromptQuery] = useState("");
  
  const handleSearch = (query: string) => {
    setPromptQuery(query);
    // In a real application, this would trigger the model generation
    console.log("Generating model with prompt:", query);
  };

  // Client-side rendering kontrolü
  useEffect(() => {
    setIsClient(true);
    
    // Gerçek uygulamada burada Supabase'den veri çekilecek
    const fetchModels = async () => {
      setLoading(true);
      try {
        // Mock data for now
        const mockModels: Model[] = [
          {
            id: "1",
            user_id: "user123",
            name: "Female Casual Model",
            gender: "female",
            age: 25,
            body_type: "slim",
            facial_features: "oval face, brown eyes",
            image_url: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            user_id: "user123",
            name: "Male Business Model",
            gender: "male",
            age: 30,
            body_type: "athletic",
            facial_features: "square face, blue eyes",
            image_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "3",
            user_id: "user123",
            name: "Female Sporty Model",
            gender: "female",
            age: 28,
            body_type: "athletic",
            facial_features: "round face, green eyes",
            image_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "4",
            user_id: "user123",
            name: "Male Casual Model",
            gender: "male",
            age: 25,
            body_type: "slim",
            facial_features: "oval face, brown eyes",
            image_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "5",
            user_id: "user123",
            name: "Female Elegant Model",
            gender: "female",
            age: 32,
            body_type: "slim",
            facial_features: "oval face, blue eyes",
            image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "6",
            user_id: "user123",
            name: "Male Urban Model",
            gender: "male",
            age: 27,
            body_type: "muscular",
            facial_features: "defined jawline, dark eyes",
            image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        
        setModels(mockModels);
      } catch (err) {
        setError("Failed to fetch models");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [setLoading, setError, setModels]);

  if (!isClient) {
    return null; // SSR sırasında boş döndür
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Your Models</h1>
        <p className="text-muted-foreground">Create and manage your virtual fashion models.</p>
      </div>
      
      {/* Prompt Generator Section */}
      <Card className="overflow-hidden border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle>Generate Model with AI</CardTitle>
          <CardDescription>
            Enter a prompt to describe the model you want to create
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <SearchBar 
                placeholder="Describe your model (e.g., 'female model, blonde hair, athletic build')..." 
                onSearch={handleSearch}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => handleSearch("female model, blonde hair, casual style")}>
                Female Casual
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSearch("male model, business attire")}>
                Male Business
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSearch("sporty female model with athletic build")}>
                Athletic Female
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSearch("male model with casual urban style")}>
                Urban Male
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Model Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Model Library</h2>
        <Button asChild>
          <Link href="/dashboard/models/create">Create New Model</Link>
        </Button>
      </div>
      
      {/* Models Grid */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">Loading your models...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-muted-foreground/20 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mx-auto text-muted-foreground"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-medium">No models found</h2>
          <p className="mt-1 text-muted-foreground">
            Create your first virtual model to get started
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/models/create">Create New Model</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div key={model.id} className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={model.image_url} 
                  alt={model.name}
                  className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-xs font-medium rounded-full shadow-sm">
                    {model.gender}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium">{model.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {model.age} years • {model.body_type}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {model.facial_features}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/models/${model.id}`}>View</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/models/edit/${model.id}`}>Edit</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 