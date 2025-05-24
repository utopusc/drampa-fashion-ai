"use client";

import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { useEffect, useState } from "react";
import MobileSidebar from "./components/mobile-sidebar";
import { AnimatePresence, motion } from "motion/react";
import { Bell, ChevronRight, LayoutDashboard, LogOut, Settings, BarChart3, Search, Users, ShoppingBag, FolderKanban, MessageSquare, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const DemoUser = {
  name: "Demo Kullanıcı",
  email: "demo@drampa.app",
  avatar: "https://ui-avatars.com/api/?name=Demo+Kullanıcı&background=FF7722&color=fff",
  role: "Free Plan"
};

// Navigation sections
const navigationItems = [
  {
    title: "Main",
    links: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        name: "Products",
        href: "/dashboard/products",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Content",
    links: [
      {
        name: "Models",
        href: "/dashboard/models",
        icon: <Users className="w-5 h-5" />,
      },
      {
        name: "Collections",
        href: "/dashboard/collections",
        icon: <FolderKanban className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Account",
    links: [
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: <Settings className="w-5 h-5" />,
      },
      {
        name: "Support",
        href: "/dashboard/support",
        icon: <MessageSquare className="w-5 h-5" />,
      },
      {
        name: "Help",
        href: "/dashboard/help",
        icon: <HelpCircle className="w-5 h-5" />,
      },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const pathname = usePathname();

  // Handle sidebar responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 256 : 80,
          transition: { duration: 0.2 },
        }}
        className="hidden lg:block fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                D
              </div>
              {isSidebarOpen && (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  DRAMPA
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="ml-auto p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isSidebarOpen ? "" : "rotate-180"
                }`}
              />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* Search */}
            {isSidebarOpen && (
              <div className="px-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg transition-all ${
                      isSearchFocused
                        ? "ring-2 ring-primary/50"
                        : "ring-0"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <nav className="space-y-6 px-2">
              {navigationItems.map((section, i) => (
                <div key={i}>
                  {isSidebarOpen && (
                    <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  )}
                  <div className={`mt-${isSidebarOpen ? "2" : "6"} space-y-1`}>
                    {section.links.map((link, j) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={j}
                          href={link.href}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                          } ${!isSidebarOpen ? "justify-center" : ""}`}
                        >
                          <span
                            className={`${
                              isActive
                                ? "text-primary"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {link.icon}
                          </span>
                          {isSidebarOpen && (
                            <span className="ml-3 truncate">{link.name}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* User Profile */}
          <div className="mt-auto px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div
              className={`flex ${
                isSidebarOpen ? "items-center" : "flex-col items-center"
              } gap-2`}
            >
              <img
                src={DemoUser.avatar}
                alt={DemoUser.name}
                className="w-8 h-8 rounded-full"
              />
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {DemoUser.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {DemoUser.email}
                  </p>
                </div>
              )}
              {isSidebarOpen && (
                <Link
                  href="/logout"
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                >
                  <LogOut className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                D
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                DRAMPA
              </span>
            </Link>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                  {notificationCount}
                </span>
              )}
            </button>
            
            <Link href="/dashboard/settings">
              <img
                src={DemoUser.avatar}
                alt={DemoUser.name}
                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
              />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 