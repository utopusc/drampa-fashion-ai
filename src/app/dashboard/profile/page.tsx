"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Camera, 
  Save, 
  Eye, 
  EyeOff, 
  Mail,
  CreditCard,
  Shield,
  Palette,
  Bell,
  Loader2,
  Check,
  X,
  Sparkles,
  Upload,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuroraText } from "@/components/magicui/aurora-text";
import Image from "next/image";
import { toast } from "sonner";
import { formatCreditsAsDollars } from "@/lib/format";
import userService from "@/services/userService";

export default function ProfilePage() {
  const { user, updateProfile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [preferences, setPreferences] = useState({
    theme: "light",
    notifications: {
      email: true,
      push: false,
      marketing: false
    },
    defaultImageSize: "square_hd"
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const orangeAuroraColors = ["#FF7722", "#FF9933", "#FFB366", "#FFC999"];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setProfileImage(user.avatar || null);
      
      // Load user preferences (if they exist in extended user data)
      const userWithPrefs = user as any;
      if (userWithPrefs.preferences) {
        setPreferences(prev => ({
          ...prev,
          ...userWithPrefs.preferences
        }));
      }
    }
    
    // Debug: Check token
    const token = localStorage.getItem('drampa_token');
    console.log('Token exists:', !!token);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('profileImage', file);
      
      // Upload image
      const response = await userService.updateProfileImage(formData) as any;
      
      if (response.success) {
        setProfileImage(response.profileImage);
        toast.success("Profile image updated successfully!");
        
        // Refresh the user profile to get updated avatar
        await refreshProfile();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates: any = {
        name: formData.name,
      };
      
      // Only update email if it changed
      if (formData.email !== user?.email) {
        updates.email = formData.email;
      }
      
      const result = await updateProfile(updates);

      if (result.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await userService.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }) as any;
      
      if (response.success) {
        toast.success("Password updated successfully!");
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    
    try {
      const response = await userService.updatePreferences(preferences) as any;
      
      if (response.success) {
        toast.success("Preferences updated successfully!");
        
        // Update theme if changed
        if (preferences.theme !== (user as any)?.preferences?.theme) {
          document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
        }
      }
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              <AuroraText colors={orangeAuroraColors} speed={0.8}>
                Account Settings
              </AuroraText>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage your profile, security settings, and preferences
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-2 mb-8">
            <nav className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.form
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleProfileUpdate}
                  className="p-8"
                >
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                    
                    {/* Profile Picture */}
                    <div className="flex items-center gap-8">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-border group-hover:border-orange-500 transition-colors">
                          {profileImage ? (
                            <Image
                              src={profileImage}
                              alt="Profile"
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-16 h-16 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="absolute bottom-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 disabled:opacity-50"
                        >
                          {uploadingImage ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Camera className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload a new avatar for your profile. Max size: 5MB
                        </p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload New
                          </button>
                          {profileImage && (
                            <button
                              type="button"
                              onClick={() => setProfileImage(null)}
                              className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg text-sm font-medium transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pl-10 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="Enter your email"
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        Account Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Account Type</p>
                          <p className="font-medium text-foreground">Free Plan</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Member Since</p>
                          <p className="font-medium text-foreground">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Account ID</p>
                          <p className="font-medium text-foreground font-mono text-xs">{user?.id || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <motion.form
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handlePasswordUpdate}
                  className="p-8"
                >
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-foreground">Security Settings</h2>
                    
                    {/* Password Change */}
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-12 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 pr-12 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 pr-12 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-6">
                      <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-200 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Password Requirements
                      </h4>
                      <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-300">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          At least 6 characters long
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Include uppercase and lowercase letters
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Include at least one number
                        </li>
                      </ul>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border-t border-border pt-8">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm rounded-full">
                          Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* Update Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading || !formData.currentPassword || !formData.newPassword}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5" />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8"
                >
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-foreground">Billing & Credits</h2>
                    
                    {/* Current Balance */}
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm mb-2">Current Balance</p>
                          <p className="text-4xl font-bold">{formatCreditsAsDollars(user?.credits || 0)}</p>
                          <p className="text-white/60 text-sm mt-2">{user?.credits || 0} credits available</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                          <CreditCard className="w-12 h-12" />
                        </div>
                      </div>
                    </div>

                    {/* Purchase Options */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Purchase Credits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { credits: 100, price: 9.99, popular: false },
                          { credits: 500, price: 39.99, popular: true },
                          { credits: 1000, price: 69.99, popular: false },
                        ].map((plan) => (
                          <div
                            key={plan.credits}
                            className={`relative border rounded-xl p-6 transition-all hover:shadow-lg cursor-pointer ${
                              plan.popular
                                ? 'border-orange-500 shadow-md'
                                : 'border-border hover:border-orange-200'
                            }`}
                          >
                            {plan.popular && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-white text-xs rounded-full">
                                Most Popular
                              </span>
                            )}
                            <div className="text-center space-y-4">
                              <p className="text-3xl font-bold text-foreground">{plan.credits}</p>
                              <p className="text-sm text-muted-foreground">Credits</p>
                              <p className="text-2xl font-bold text-orange-600">${plan.price}</p>
                              <button className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium">
                                Purchase
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transaction History */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
                      <div className="bg-muted/50 rounded-xl p-8 text-center">
                        <p className="text-muted-foreground">No transactions yet</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8"
                >
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-foreground">Preferences</h2>
                    
                    {/* Theme */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Appearance</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: '☀️' },
                          { value: 'dark', label: 'Dark', icon: '🌙' },
                          { value: 'system', label: 'System', icon: '💻' },
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => setPreferences(prev => ({ ...prev, theme: theme.value }))}
                            className={`p-4 rounded-xl border transition-all ${
                              preferences.theme === theme.value
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                                : 'border-border hover:border-orange-200'
                            }`}
                          >
                            <div className="text-3xl mb-2">{theme.icon}</div>
                            <p className="font-medium text-foreground">{theme.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Default Image Size */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Default Image Size</h3>
                      <select
                        value={preferences.defaultImageSize}
                        onChange={(e) => setPreferences(prev => ({ ...prev, defaultImageSize: e.target.value }))}
                        className="w-full md:w-auto px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="square">Square (1:1)</option>
                        <option value="square_hd">Square HD (1:1)</option>
                        <option value="portrait">Portrait (2:3)</option>
                        <option value="portrait_hd">Portrait HD (2:3)</option>
                        <option value="landscape">Landscape (3:2)</option>
                        <option value="landscape_hd">Landscape HD (3:2)</option>
                      </select>
                    </div>

                    {/* Notifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <p className="font-medium text-foreground">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates about your generations</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.notifications.email}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, email: e.target.checked }
                            }))}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <p className="font-medium text-foreground">Marketing Emails</p>
                            <p className="text-sm text-muted-foreground">New features and special offers</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.notifications.marketing}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, marketing: e.target.checked }
                            }))}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handlePreferencesUpdate}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Preferences
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}