"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Calendar, ChevronDown, Download, TrendingUp, Users, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const dateRanges = [
  { id: "7d", name: "Last 7 Days" },
  { id: "30d", name: "Last 30 Days" },
  { id: "90d", name: "Last 3 Months" },
  { id: "1y", name: "Last Year" },
];

// Mock data
const mockVisits = [1200, 1900, 3000, 5000, 4000, 6500, 7200];
const mockConversions = [120, 190, 250, 400, 320, 550, 650];
const mockWeekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState(dateRanges[0]);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  
  // Calculate totals
  const totalVisits = mockVisits.reduce((acc, curr) => acc + curr, 0);
  const totalConversions = mockConversions.reduce((acc, curr) => acc + curr, 0);
  const conversionRate = ((totalConversions / totalVisits) * 100).toFixed(1);
  
  // Find max values for relative scaling
  const maxVisit = Math.max(...mockVisits);
  const maxConversion = Math.max(...mockConversions);
  
  // Get comparison values (mock: 20% increase from previous period)
  const prevTotalVisits = Math.round(totalVisits * 0.8);
  const visitChange = Math.round(((totalVisits - prevTotalVisits) / prevTotalVisits) * 100);
  const prevConversionRate = (parseFloat(conversionRate) * 0.9).toFixed(1);
  const conversionRateChange = Math.round(
    ((parseFloat(conversionRate) - parseFloat(prevConversionRate)) / parseFloat(prevConversionRate)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor your product performance and user engagement
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{dateRange.name}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            {isDateDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 w-48">
                {dateRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => {
                      setDateRange(range);
                      setIsDateDropdownOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      dateRange.id === range.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Visits</h2>
            <div className="flex items-center gap-1 text-xs font-medium">
              <TrendingUp className={`w-3 h-3 ${visitChange >= 0 ? "text-green-500" : "text-red-500"}`} />
              <span className={visitChange >= 0 ? "text-green-500" : "text-red-500"}>
                {visitChange}%
              </span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalVisits.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 pb-1.5">
              vs {prevTotalVisits.toLocaleString()} last period
            </span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</h2>
            <div className="flex items-center gap-1 text-xs font-medium">
              <TrendingUp className={`w-3 h-3 ${conversionRateChange >= 0 ? "text-green-500" : "text-red-500"}`} />
              <span className={conversionRateChange >= 0 ? "text-green-500" : "text-red-500"}>
                {conversionRateChange}%
              </span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {conversionRate}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 pb-1.5">
              vs {prevConversionRate}% last period
            </span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h2>
            <div className="flex items-center gap-1 text-xs font-medium">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">12%</span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              783
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 pb-1.5">
              vs 699 last period
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
          <div className="flex items-center mt-3 sm:mt-0">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Visits</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Conversions</span>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-80 w-full">
          <div className="relative h-full">
            {/* Chart Background Grid */}
            <div className="absolute inset-0 grid grid-cols-7 gap-px border-b border-gray-200 dark:border-gray-700">
              {Array(7).fill(0).map((_, i) => (
                <div key={i} className="border-l border-gray-200 dark:border-gray-700 h-full"></div>
              ))}
            </div>
            
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="border-t border-gray-200 dark:border-gray-700 w-full"></div>
              ))}
            </div>
            
            {/* Chart Bars */}
            <div className="absolute inset-0 flex items-end justify-between px-2 pt-6 pb-1">
              {mockVisits.map((visits, i) => (
                <div key={i} className="flex flex-col items-center gap-1 w-8 sm:w-16 relative">
                  {/* Visit Bar */}
                  <div 
                    className="bg-primary/90 w-6 sm:w-10 rounded-t-md"
                    style={{ 
                      height: `${(visits / maxVisit) * 70}%`, 
                      transition: 'height 0.3s ease-out' 
                    }}
                  ></div>
                  
                  {/* Conversion Bar */}
                  <div 
                    className="bg-blue-500/90 w-6 sm:w-10 rounded-t-md absolute bottom-0 z-10"
                    style={{ 
                      height: `${(mockConversions[i] / maxVisit) * 70}%`,
                      transition: 'height 0.3s ease-out'
                    }}
                  ></div>
                  
                  {/* Label */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 absolute -bottom-6">
                    {mockWeekdays[i]}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Y-Axis Labels */}
            <div className="absolute -left-12 inset-y-0 flex flex-col justify-between py-1">
              {[maxVisit, maxVisit * 0.75, maxVisit * 0.5, maxVisit * 0.25, 0].map((value, i) => (
                <div key={i} className="text-xs text-gray-500 dark:text-gray-400">
                  {value.toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Top Products</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[
              { name: "Summer Dress 2024", views: 3240, conversions: 156, image: "https://placehold.co/100x100/FFF0E6/FF7722?text=👗" },
              { name: "Classic Leather Bag", views: 2890, conversions: 132, image: "https://placehold.co/100x100/FFF0E6/FF7722?text=👜" },
              { name: "Running Shoes", views: 2120, conversions: 98, image: "https://placehold.co/100x100/FFF0E6/FF7722?text=👟" },
              { name: "Casual T-Shirt", views: 1980, conversions: 87, image: "https://placehold.co/100x100/FFF0E6/FF7722?text=👕" },
            ].map((product, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{product.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{product.conversions} conversions</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary">
                    {((product.conversions / product.views) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">conversion rate</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30 text-center">
            <button className="text-sm font-medium text-primary hover:text-primary/80">
              View All Products
            </button>
          </div>
        </motion.div>
        
        {/* User Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">User Demographics</h2>
          
          <div className="space-y-6">
            {/* Age Groups */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Age Groups</h3>
              <div className="space-y-2">
                {[
                  { age: "18-24", percentage: 15 },
                  { age: "25-34", percentage: 42 },
                  { age: "35-44", percentage: 28 },
                  { age: "45-54", percentage: 10 },
                  { age: "55+", percentage: 5 },
                ].map((group, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-gray-500 dark:text-gray-400">{group.age}</div>
                    <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-xs text-gray-500 dark:text-gray-400 text-right">
                      {group.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Devices */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Devices</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-8 border-primary/20 mb-2 flex items-center justify-center">
                    <span className="text-lg font-bold">68%</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Mobile</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-8 border-blue-500/20 mb-2 flex items-center justify-center">
                    <span className="text-lg font-bold">24%</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Desktop</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-8 border-purple-500/20 mb-2 flex items-center justify-center">
                    <span className="text-lg font-bold">8%</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Tablet</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 