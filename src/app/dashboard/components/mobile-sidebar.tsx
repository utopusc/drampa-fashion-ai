"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, LayoutDashboard, BarChart3, ShoppingBag, Users, FolderKanban, Settings, MessageSquare, HelpCircle, LogOut, Search } from "lucide-react";
import { usePathname } from "next/navigation";

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { opacity: 0, x: -300 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    x: -300,
    transition: { duration: 0.2 },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2 }
  },
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

const DemoUser = {
  name: "Demo Kullanıcı",
  email: "demo@drampa.app",
  avatar: "https://ui-avatars.com/api/?name=Demo+Kullanıcı&background=FF7722&color=fff",
  role: "Free Plan"
};

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeSidebar}
            />

            {/* Sidebar */}
            <motion.div
              key="sidebar"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-gray-800 z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSidebar}>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                    D
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    DRAMPA
                  </span>
                </Link>
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* User Profile - Mobile */}
              <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <img
                    src={DemoUser.avatar}
                    alt={DemoUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{DemoUser.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{DemoUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Search - Mobile */}
              <div className="px-4 py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border-0 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-2 px-3 space-y-6">
                {navigationItems.map((section, i) => (
                  <motion.div key={i} variants={menuItemVariants}>
                    <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.links.map((link, j) => {
                        const isActive = pathname === link.href;
                        return (
                          <motion.div key={j} variants={menuItemVariants}>
                            <Link
                              href={link.href}
                              onClick={closeSidebar}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              <span className={isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"}>
                                {link.icon}
                              </span>
                              <span>{link.name}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer with Logout Button */}
              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeSidebar}
                  className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 