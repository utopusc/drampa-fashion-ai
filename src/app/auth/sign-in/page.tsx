"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { MagicCard } from "@/components/magicui/magic-card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Particles } from "@/components/magicui/particles";
import { useTheme } from "next-themes";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const { login } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await login({ email, password });
      if (result.success) {
        router.push("/dashboard");
      } else {
        setMessage(result.message || "Sign in failed");
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={60}
        ease={80}
        color={theme === "dark" ? "#ffffff" : "#000000"}
        refresh
      />

      {/* Back to Home Button */}
              <Link
        href="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
              </Link>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl z-10"
      >
        <div className="mx-auto max-w-lg">
          <MagicCard
            className="relative overflow-hidden bg-background/95 backdrop-blur-xl border-border/50"
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
          >
            <BorderBeam size={80} duration={12} delay={2} />
            
            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Welcome back
                </h1>
                <p className="text-muted-foreground text-base md:text-lg">
                  Sign in to your DRAMPA account
            </p>
          </div>

              {/* Error Message */}
            {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                {message}
                </motion.div>
            )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email Field */}
                <div className="space-y-3">
                  <label htmlFor="email" className="text-base font-medium text-foreground">
                    Email
                </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-14 pr-4 py-5 text-lg bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      required
                  />
                </div>
            </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <label htmlFor="password" className="text-base font-medium text-foreground">
                    Password
                </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                  <input
              id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-14 pr-16 py-5 text-lg bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                      required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                  </button>
              </div>
            </div>

                {/* Sign In Button */}
                <motion.button
                type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-primary-foreground py-5 text-lg font-medium rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
            ) : (
                    "Sign In"
            )}
                </motion.button>
              </form>

              {/* Footer */}
              <div className="mt-12 text-center">
                <p className="text-lg text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </MagicCard>
        </div>
      </motion.div>
    </div>
  );
} 