"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Search, User, Settings, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuroraText } from "@/components/magicui/aurora-text";
import { formatCreditsAsDollars } from "@/lib/format";

export default function DashboardNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Home", href: "/dashboard" },
    { name: "Gallery", href: "/dashboard/gallery" },
    { name: "Fashion AI", href: "/dashboard/fashion-ai" },
    { name: "Pricing", href: "/pricing" },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    router.push("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine if we should link logo to home or stay on dashboard
  const logoHref = pathname?.startsWith("/dashboard") ? "/dashboard" : "/";

  return (
    <header className="sticky top-6 z-50 mx-4 flex justify-center">
      <motion.div
        initial={{ width: "100%" }}
        className="w-full max-w-7xl"
      >
        <nav className="mx-auto rounded-2xl backdrop-blur-lg bg-card/90 border border-border shadow-lg">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Logo */}
            <Link href={logoHref} className="flex items-center group">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xl font-bold text-foreground tracking-tight">
                  <AuroraText colors={["#FF7722", "#FF9933", "#FFB366", "#FFC999"]} speed={0.8}>
                    DRAMPA
                  </AuroraText>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 bg-muted/50 rounded-xl p-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-foreground bg-card shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-card shadow-sm rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search - Desktop */}
              <div className="hidden xl:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-80 bg-muted/80 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring focus:bg-card transition-all text-sm placeholder-muted-foreground"
                  />
                </div>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Create Button */}
              <Link href="/create">
                <motion.button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    <AuroraText colors={["#FFFFFF", "#FFF5F0", "#FFFFFF", "#FFE5D9"]} speed={1.0}>
                      Create
                    </AuroraText>
                  </span>
                </motion.button>
              </Link>

              {/* User Profile or Auth Buttons */}
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted/50 transition-colors border border-border"
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-xl flex items-center justify-center text-sm font-medium shadow-sm">
                      {getInitials(user.name || "User")}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-foreground truncate max-w-24">
                        {user.name?.split(' ')[0] || 'User'}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 bg-card rounded-2xl shadow-xl border border-border py-3 overflow-hidden backdrop-blur-lg"
                      onMouseLeave={() => setShowProfileDropdown(false)}
                    >
                      {/* User Info Header */}
                      <div className="px-6 py-5 border-b border-border">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl flex items-center justify-center text-lg font-medium shadow-md">
                            {getInitials(user.name || "User")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-foreground truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="px-6 py-4 bg-muted/30 border-b border-border">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Projects</p>
                            <p className="text-lg font-bold text-foreground">0</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Models</p>
                            <p className="text-lg font-bold text-foreground">0</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Balance</p>
                            <p className="text-lg font-bold text-foreground">{formatCreditsAsDollars(user.credits || 0)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-3">
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center px-6 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <User className="w-5 h-5 mr-4" />
                          Profile Settings
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center px-6 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <Settings className="w-5 h-5 mr-4" />
                          Account Settings
                        </Link>
                        <div className="border-t border-border mt-3 pt-3">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-6 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <LogOut className="w-5 h-5 mr-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/sign-in"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5 rounded-xl hover:bg-muted/50"
                  >
                    Sign In
                  </Link>
                  <Link href="/auth/sign-up">
                    <motion.button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-xl hover:bg-muted/50 transition-colors border border-border"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-border bg-card/95 backdrop-blur-lg rounded-b-2xl"
            >
              <div className="px-6 py-6 space-y-4">
                {/* Search - Mobile */}
                <div className="xl:hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full bg-muted border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring focus:bg-card transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                        isActive(item.href)
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </nav>
      </motion.div>
    </header>
  );
} 