"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "demo@drampa.app",
    password: "password123",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Sadece formu gönderdikten sonra dashboard'a yönlendiriyoruz
      // Gerçek uygulamada burada Supabase auth kontrolü yapılacak
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-muted-foreground hover:text-[#FF7722]"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="bg-[#FF7722] hover:bg-[#E65100]">
            {isLoading ? (
              <span className="flex items-center justify-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <Button variant="outline" onClick={onSubmit} type="button" className="bg-[#FFF0E6] hover:bg-[#FFE0CC] text-[#E65100] dark:bg-[#331400]/20 dark:text-[#FF9966]">
        {isLoading ? (
          <span className="flex items-center justify-center gap-1">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E65100] border-r-transparent dark:border-[#FF9966]"></span>
            <span>Signing in as Demo...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Login as Demo User
          </span>
        )}
      </Button>
      
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/auth/sign-up" className="text-[#FF7722] underline hover:text-[#E65100]">
          Sign up
        </Link>
      </div>
    </div>
  );
} 