"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModelStore } from "@/store/modelStore";
import { Model } from "@/types";

export default function CreateModelPage() {
  const router = useRouter();
  const { addModel } = useModelStore();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    gender: "female",
    age: 25,
    bodyType: "slim",
    facialFeatures: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Gerçek uygulamada burada AI API'a istek atılacak
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dummyImageUrls = {
        female: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800",
        male: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800",
        other: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800",
      };
      
      const newModel: Model = {
        id: Date.now().toString(),
        user_id: "user123", // Bu gerçek uygulamada otantike kullanıcı ID'si olacak
        name: formData.name,
        gender: formData.gender as 'male' | 'female' | 'other',
        age: Number(formData.age),
        body_type: formData.bodyType,
        facial_features: formData.facialFeatures,
        image_url: dummyImageUrls[formData.gender as keyof typeof dummyImageUrls],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      addModel(newModel);
      router.push('/dashboard/models');
    } catch (error) {
      console.error("Error creating model:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    setIsLoading(true);
    
    try {
      // Gerçek uygulamada burada AI API'a istek atılacak
      // Mock preview image
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyImageUrls = {
        female: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800",
        male: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800",
        other: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800",
      };
      
      setPreviewImage(dummyImageUrls[formData.gender as keyof typeof dummyImageUrls]);
    } catch (error) {
      console.error("Error generating preview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create New Model</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/models">Cancel</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Model Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="e.g. My Casual Female Model" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select 
                  id="gender" 
                  name="gender" 
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  name="age" 
                  type="number" 
                  min="16" 
                  max="80" 
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="bodyType">Body Type</Label>
                <select 
                  id="bodyType" 
                  name="bodyType" 
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.bodyType}
                  onChange={handleInputChange}
                >
                  <option value="slim">Slim</option>
                  <option value="athletic">Athletic</option>
                  <option value="curvy">Curvy</option>
                  <option value="plus-size">Plus Size</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="facialFeatures">Facial Features</Label>
                <textarea 
                  id="facialFeatures" 
                  name="facialFeatures" 
                  rows={3}
                  className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. oval face, brown eyes, short blonde hair"
                  value={formData.facialFeatures}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handlePreview} disabled={isLoading}>
                {isLoading && !previewImage ? (
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                ) : null}
                Generate Preview
              </Button>
              <Button type="submit" disabled={isLoading || !previewImage}>
                {isLoading && previewImage ? (
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-2"></div>
                ) : null}
                Create Model
              </Button>
            </div>
          </form>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-6 flex flex-col items-center justify-center">
          {previewImage ? (
            <div className="w-full">
              <h2 className="text-lg font-medium mb-4 text-center">Model Preview</h2>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted relative">
                <img 
                  src={previewImage} 
                  alt="Model Preview" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ) : (
            <div className="text-center p-10">
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
              <h2 className="mt-4 text-lg font-medium">Preview your model</h2>
              <p className="mt-1 text-muted-foreground">
                Fill in the form and click "Generate Preview" to see how your model will look.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 