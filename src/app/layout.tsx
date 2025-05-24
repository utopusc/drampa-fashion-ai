"use client";

import { Navbar } from "@/components/sections/navbar";
import { siteConfig } from "@/lib/config";
import { metadata, viewport } from "./metadata";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { usePathname } from "next/navigation";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{siteConfig.name} - {siteConfig.description}</title>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background`}
      >
        <Providers>
          <div className="max-w-7xl mx-auto relative">
            {!isDashboard && <Navbar />}
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
