"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useState } from "react";
import { Bell, Check, CreditCard, Lock, Mail, Save, User } from "lucide-react";

const tabs = [
  { id: "profile", name: "Profile", icon: <User className="w-5 h-5" /> },
  { id: "account", name: "Account", icon: <Lock className="w-5 h-5" /> },
  { id: "notifications", name: "Notifications", icon: <Bell className="w-5 h-5" /> },
  { id: "billing", name: "Billing", icon: <CreditCard className="w-5 h-5" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formState, setFormState] = useState({
    fullName: "Demo Kullanıcı",
    email: "demo@drampa.app",
    bio: "Fashion enthusiast and designer at Drampa.",
    darkMode: "system",
    emailNotifications: {
      products: true,
      security: true,
      promotions: false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (category: string) => {
    setFormState((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [category]: !prev.emailNotifications[category as keyof typeof prev.emailNotifications],
      },
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs and Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 shrink-0"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40"
                  }`}
                >
                  <span className={activeTab === tab.id ? "text-primary" : "text-gray-500 dark:text-gray-400"}>
                    {tab.icon}
                  </span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent rounded-xl p-4 border border-primary/10">
            <h3 className="text-sm font-medium mb-2">Need help?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Contact our support team if you have any questions or need assistance.
            </p>
            <Button variant="outline" size="sm" className="w-full border-primary/20 text-primary hover:bg-primary/10">
              Contact Support
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          {activeTab === "profile" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="shrink-0">
                    <div className="relative">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${formState.fullName.replace(" ", "+")}&background=FF7722&color=fff&size=128`} 
                        alt={formState.fullName} 
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-sm" 
                      />
                      <button className="absolute bottom-0 right-0 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white shadow-sm transition-colors hover:bg-primary/90">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formState.fullName}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formState.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <Button variant="outline" size="sm" className="shrink-0">
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formState.bio}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Brief description for your profile.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end">
                  <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "account" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Appearance</h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="light"
                        name="darkMode"
                        value="light"
                        checked={formState.darkMode === "light"}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <label htmlFor="light" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Light
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="dark"
                        name="darkMode"
                        value="dark"
                        checked={formState.darkMode === "dark"}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <label htmlFor="dark" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Dark
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="system"
                        name="darkMode"
                        value="system"
                        checked={formState.darkMode === "system"}
                        onChange={handleRadioChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <label htmlFor="system" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        System
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Password</h3>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    
                    <div>
                      <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Danger Zone</h3>
                  
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">Delete Account</h4>
                    <p className="text-xs text-red-600 dark:text-red-300 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="outline" className="border-red-300 dark:border-red-400/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "notifications" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Email Notifications</h3>
                  
                  <div className="space-y-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Updates</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when a product is uploaded or updated.</p>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleCheckboxChange("products")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            formState.emailNotifications.products ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`${
                              formState.emailNotifications.products ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Alerts</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when your account has login attempts or security changes.</p>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleCheckboxChange("security")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            formState.emailNotifications.security ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`${
                              formState.emailNotifications.security ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Promotional Emails</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive emails about new features, promotions, and offers.</p>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleCheckboxChange("promotions")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            formState.emailNotifications.promotions ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`${
                              formState.emailNotifications.promotions ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end">
                  <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "billing" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
              
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Free Plan</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">You are currently on the free plan.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Plans</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 inline-block px-2 py-1 rounded-full text-xs font-medium mb-2">
                        Current
                      </div>
                      <h4 className="text-base font-semibold mb-1">Free</h4>
                      <p className="text-2xl font-bold mb-2">$0<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
                      <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>5 product uploads</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>2 AI model creations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Basic visualizations</span>
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    </div>
                    
                    <div className="border border-primary rounded-lg p-4 bg-white dark:bg-gray-800 relative">
                      <div className="absolute -top-3 -right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                        Popular
                      </div>
                      <div className="bg-primary/10 text-primary inline-block px-2 py-1 rounded-full text-xs font-medium mb-2">
                        Pro
                      </div>
                      <h4 className="text-base font-semibold mb-1">Professional</h4>
                      <p className="text-2xl font-bold mb-2">$19<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
                      <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Unlimited product uploads</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>10 AI model creations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Advanced visualizations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Priority support</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        Upgrade Now
                      </Button>
                    </div>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400 inline-block px-2 py-1 rounded-full text-xs font-medium mb-2">
                        Enterprise
                      </div>
                      <h4 className="text-base font-semibold mb-1">Business</h4>
                      <p className="text-2xl font-bold mb-2">$49<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
                      <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Unlimited everything</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Custom AI models</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>API access</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Dedicated support</span>
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full">
                        Contact Sales
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Method</h3>
                  
                  <Button variant="outline" className="gap-2">
                    <CreditCard className="w-4 h-4" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 