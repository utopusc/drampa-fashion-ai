"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowRight, Bell, Calendar, ChevronRight, Clock, TrendingUp, Users, X } from "lucide-react";

export default function DashboardPage() {
  const [showUploadNotice, setShowUploadNotice] = useState(false);
  const [stats, setStats] = useState({
    products: 12,
    models: 5,
    collections: 3,
    views: 325
  });
  
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's an overview of your fashion visualizations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <Button 
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <span>Create New</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Upload Notice */}
      <AnimatePresence>
        {showUploadNotice && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Product image uploaded successfully!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">You can now visualize it on your models.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowUploadNotice(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Products</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.products}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-500">+4 new</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">this week</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Models</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.models}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-500">+2 new</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">this week</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Collections</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.collections}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-500">+1 new</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">this week</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Page Views</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.views}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-500">+32</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">this week</span>
          </div>
        </motion.div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Products */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Recent Products</h3>
              <Link 
                href="/dashboard/products" 
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {[
                { name: "Summer Dress 2024", type: "Clothing", date: "2 hours ago", image: "https://placehold.co/100x100/FFF0E6/FF7722?text=👗" },
                { name: "Classic Leather Bag", type: "Accessory", date: "Yesterday", image: "https://placehold.co/100x100/FFF0E6/FF7722?text=👜" },
                { name: "Running Shoes", type: "Footwear", date: "2 days ago", image: "https://placehold.co/100x100/FFF0E6/FF7722?text=👟" },
              ].map((product, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-12 h-12 rounded-lg object-cover" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{product.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Upload Product", icon: "📤", link: "/dashboard/products/create", color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
                { name: "Create Model", icon: "👤", link: "/dashboard/models/create", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
                { name: "New Collection", icon: "📁", link: "/dashboard/collections/create", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
                { name: "Share Results", icon: "📱", link: "/dashboard/share", color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.link}
                  className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center text-xl mb-2`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{action.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Getting Started */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 rounded-xl p-6 shadow-sm border border-primary/10"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h3>
            <ul className="space-y-3">
              {[
                { text: "Create a custom virtual model", done: true },
                { text: "Upload your first product", done: true },
                { text: "Visualize product on model", done: false },
                { text: "Save to collection", done: false },
                { text: "Share your creations", done: false },
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.done ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'}`}>
                    {step.done && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${step.done ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white font-medium'}`}>
                    {step.text}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full mt-4 border-primary/20 text-primary hover:bg-primary/10">
              Continue Setup
            </Button>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-7 border-l-2 border-dashed border-gray-200 dark:border-gray-700 z-0"></div>
              <ul className="relative z-10">
                {[
                  { text: "Product uploaded", time: "2 hours ago", icon: "📤", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
                  { text: "Model created", time: "Yesterday", icon: "👤", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
                  { text: "Settings updated", time: "2 days ago", icon: "⚙️", color: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400" },
                  { text: "Account created", time: "1 week ago", icon: "🎉", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
                ].map((activity, i) => (
                  <li key={i} className="relative px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center text-sm shrink-0`}>
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.text}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notifications */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <button className="relative w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-primary border-2 border-primary">3</span>
        </button>
      </motion.div>
    </div>
  );
} 