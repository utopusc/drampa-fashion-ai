"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { useProductStore } from "@/store/productStore";

export default function ProductsPage() {
  const { products, loading, error, setProducts, setLoading, setError } = useProductStore();
  const [isClient, setIsClient] = useState(false);

  // Client-side rendering kontrolü
  useEffect(() => {
    setIsClient(true);
    
    // Gerçek uygulamada burada Supabase'den veri çekilecek
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Mock data for now
        const mockProducts: Product[] = [
          {
            id: "1",
            user_id: "user123",
            name: "Summer Dress",
            category: "clothing",
            description: "Light summer dress with floral pattern",
            image_url: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            user_id: "user123",
            name: "Leather Handbag",
            category: "bags",
            description: "Genuine leather handbag with gold accents",
            image_url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "3",
            user_id: "user123",
            name: "Gold Necklace",
            category: "accessories",
            description: "18K gold necklace with pendant",
            image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        
        setProducts(mockProducts);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setLoading, setError, setProducts]);

  if (!isClient) {
    return null; // SSR sırasında boş döndür
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Products</h1>
        <Button asChild>
          <Link href="/dashboard/products/create">Upload New Product</Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">Loading your products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : products.length === 0 ? (
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
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-medium">No products found</h2>
          <p className="mt-1 text-muted-foreground">
            Upload your first product to get started
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/products/create">Upload Product</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 bg-background text-xs px-2 py-1 rounded-full text-muted-foreground">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/products/${product.id}`}>View</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/products/edit/${product.id}`}>Edit</Link>
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