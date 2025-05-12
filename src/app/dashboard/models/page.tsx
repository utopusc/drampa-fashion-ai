"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Model } from "@/types";
import { useModelStore } from "@/store/modelStore";

export default function ModelsPage() {
  const { models, loading, error, setModels, setLoading, setError } = useModelStore();
  const [isClient, setIsClient] = useState(false);

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Models</h1>
        <Button asChild>
          <Link href="/dashboard/models/create">Create New Model</Link>
        </Button>
      </div>
      
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
            <div key={model.id} className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={model.image_url} 
                  alt={model.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium">{model.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {model.gender}, {model.age} years, {model.body_type}
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