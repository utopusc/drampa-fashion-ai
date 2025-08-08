"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, Mail, Camera, Trash2, Bell, Shield, Globe, Palette, Key } from "lucide-react";
import { motion } from "framer-motion";
import fashnService from "@/services/fashnService";

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabProps[] = [
  { id: "account", label: "Account Settings", icon: <User className="w-4 h-4" /> },
  { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "preferences", label: "Preferences", icon: <Palette className="w-4 h-4" /> },
  { id: "fashionai", label: "Fashion AI", icon: <Key className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Profile form states
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  
  // Password form states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Fashion AI states
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [credits, setCredits] = useState<{
    total: number;
    subscription: number;
    on_demand: number;
  } | null>(null);
  
  const { user, updateProfile, changePassword } = useAuth();

  // Initialize profile data when user is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  // Load saved API key
  useEffect(() => {
    const savedKey = localStorage.getItem('fashn_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      fashnService.setApiKey(savedKey);
      checkCredits(savedKey);
    }
  }, []);

  const checkCredits = async (key: string) => {
    try {
      fashnService.setApiKey(key);
      const creditsData = await fashnService.getCredits();
      setCredits(creditsData.credits);
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setSuccessMessage("Profil başarıyla güncellendi!");
      } else {
        setErrorMessage(result.message || "Profil güncellenemedi.");
      }
    } catch (error) {
      setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Yeni şifreler eşleşmiyor.");
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage("Yeni şifre en az 6 karakter olmalıdır.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (result.success) {
        setSuccessMessage("Şifre başarıyla değiştirildi!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setErrorMessage(result.message || "Şifre değiştirilemedi.");
      }
    } catch (error) {
      setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyApiKey = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Please enter an API key');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      fashnService.setApiKey(apiKey);
      const creditsData = await fashnService.getCredits();
      setCredits(creditsData.credits);
      setSuccessMessage('API key verified successfully!');
    } catch (error: any) {
      setErrorMessage(error.message || 'Invalid API key');
      setCredits(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Please enter an API key');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Save to localStorage
      localStorage.setItem('fashn_api_key', apiKey);
      fashnService.setApiKey(apiKey);
      setSuccessMessage('API key saved successfully!');
    } catch (error) {
      setErrorMessage('Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF7722&color=fff`;

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profil Fotoğrafı
                </CardTitle>
                <CardDescription>
                  Profil fotoğrafınızı güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                  />
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      Fotoğraf Yükle
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG veya GIF formatında, maksimum 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Kişisel Bilgiler
                </CardTitle>
                <CardDescription>
                  Hesap bilgilerinizi güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Ad Soyad
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      E-posta Adresi
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setProfileData({ name: user.name, email: user.email })}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Plan Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Plan Bilgileri
                </CardTitle>
                <CardDescription>
                  Mevcut planınız ve özellikleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">{user.plan} Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      {user.plan === 'free' ? 'Ücretsiz kullanım' : 'Premium özellikler'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Planı Yükselt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Şifre Değiştir
                </CardTitle>
                <CardDescription>
                  Hesabınızın güvenliği için güçlü bir şifre kullanın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-2">
                      Mevcut Şifre
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
                      Yeni Şifre
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Hesap Güvenliği
                </CardTitle>
                <CardDescription>
                  Hesabınızın güvenlik ayarları
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">İki Faktörlü Doğrulama</h4>
                    <p className="text-sm text-muted-foreground">
                      Hesabınız için ekstra güvenlik katmanı
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Etkinleştir
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Oturum Geçmişi</h4>
                    <p className="text-sm text-muted-foreground">
                      Hesabınıza erişim geçmişini görüntüleyin
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Bildirim Tercihleri
                </CardTitle>
                <CardDescription>
                  Hangi bildirimleri almak istediğinizi seçin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "email", label: "E-posta Bildirimleri", description: "Önemli güncellemeler için e-posta alın" },
                  { id: "marketing", label: "Pazarlama E-postaları", description: "Yeni özellikler ve promosyonlar hakkında bilgi alın" },
                  { id: "security", label: "Güvenlik Uyarıları", description: "Şüpheli etkinlikler için anında bildirim" },
                  { id: "project", label: "Proje Güncellemeleri", description: "Projelerinizde değişiklikler olduğunda bildirim" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Görünüm Tercihleri
                </CardTitle>
                <CardDescription>
                  Uygulamanın görünümünü özelleştirin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Tema</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {["light", "dark", "system"].map((theme) => (
                      <button
                        key={theme}
                        className="p-3 border rounded-lg text-sm font-medium capitalize hover:bg-muted transition-colors"
                      >
                        {theme === "system" ? "Sistem" : theme === "light" ? "Açık" : "Koyu"}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Dil ve Bölge
                </CardTitle>
                <CardDescription>
                  Dil ve bölge ayarlarınızı yapılandırın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dil
                  </label>
                  <select className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm">
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Saat Dilimi
                  </label>
                  <select className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm">
                    <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "fashionai":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Fashion AI API Configuration
                </CardTitle>
                <CardDescription>
                  Configure your FASHN API key for virtual try-on features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your FASHN API key"
                      className="block w-full rounded-lg border border-input bg-background px-3 py-2 pr-24 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm font-mono"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        {showApiKey ? "Hide" : "Show"}
                      </button>
                      <Button
                        onClick={handleVerifyApiKey}
                        disabled={isVerifying || !apiKey.trim()}
                        size="sm"
                        variant="outline"
                      >
                        {isVerifying ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Don&apos;t have an API key? 
                    <a 
                      href="https://fashn.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      Get one from FASHN
                    </a>
                  </p>
                </div>

                {credits && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      API Credits Balance
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{credits.total}</p>
                        <p className="text-xs text-muted-foreground">Total Credits</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{credits.subscription}</p>
                        <p className="text-xs text-muted-foreground">Subscription</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{credits.on_demand}</p>
                        <p className="text-xs text-muted-foreground">On-Demand</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-medium mb-2">How it works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Each virtual try-on costs 1 credit ($0.075)</li>
                    <li>• Credits are deducted only for successful generations</li>
                    <li>• Failed attempts are not charged</li>
                    <li>• Your API key is stored locally and securely</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveApiKey}
                    disabled={isLoading || !apiKey.trim()}
                  >
                    {isLoading ? "Saving..." : "Save API Key"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
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
            <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground mt-2">
              Configure your account preferences, notifications, and security options
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg"
        >
          {successMessage}
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg"
        >
          {errorMessage}
        </motion.div>
      )}

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
            className="bg-card rounded-lg border border-border shadow-sm"
      >
            <div className="p-6">
        {renderTabContent()}
            </div>
          </motion.div>
      </motion.div>
      </div>
    </div>
  );
} 