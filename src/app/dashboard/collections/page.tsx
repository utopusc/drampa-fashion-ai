"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Collection } from "@/types";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Client-side rendering kontrolü
  useEffect(() => {
    setIsClient(true);
    
    // Gerçek uygulamada burada Supabase'den veri çekilecek
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        // Mock data for now
        const mockCollections: Collection[] = [
          {
            id: "1",
            user_id: "user123",
            name: "Summer Collection 2024",
            description: "Light and airy fashion pieces for summer",
            is_public: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            user_id: "user123",
            name: "Winter Essentials",
            description: "Warm and stylish pieces for the winter season",
            is_public: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating network delay
        setCollections(mockCollections);
      } catch (err) {
        setError("Failed to fetch collections");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (!isClient) {
    return null; // SSR sırasında boş döndür
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Collections</h1>
        <Button asChild>
          <Link href="/dashboard/collections/create">Create New Collection</Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">Loading your collections...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : collections.length === 0 ? (
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
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-medium">No collections found</h2>
          <p className="mt-1 text-muted-foreground">
            Create your first collection to organize your designs
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/collections/create">Create Collection</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div key={collection.id} className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{collection.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs ${collection.is_public ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {collection.is_public ? 'Public' : 'Private'}
                  </div>
                </div>
                
                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {collection.description}
                  </p>
                )}
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {/* Grid for preview images - in a real app, these would be actual design images */}
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="aspect-square bg-muted rounded-md"></div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href={`/dashboard/collections/${collection.id}`}>View</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href={`/dashboard/collections/edit/${collection.id}`}>Edit</Link>
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