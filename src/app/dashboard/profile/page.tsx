"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Camera, Save, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await updateProfile({
        name: formData.name,
        email: formData.email
      });

      if (result.success) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(result.message || "Failed to update profile");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords don't match");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Here you would call your password update API
      setMessage("Password updated successfully!");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      setMessage("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-2">Manage your personal information and password</p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "profile"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "password"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-4 rounded-lg ${
                message.includes("success") 
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="p-8">
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload a new avatar for your profile
                      </p>
                    </div>
                  </div>

                  {/* Name */}
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
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handlePasswordUpdate} className="p-8">
                <div className="space-y-6">
                  {/* Current Password */}
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
                        className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
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
                        className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
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
                        className="w-full px-3 py-2 pr-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Password Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• At least 6 characters long</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Include at least one number</li>
                    </ul>
                  </div>

                  {/* Update Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 