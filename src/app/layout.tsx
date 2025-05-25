"use client";

import { Navbar } from "@/components/sections/navbar";
import { siteConfig } from "@/lib/config";
import { metadata, viewport } from "./metadata";
import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { usePathname } from "next/navigation";
import Head from "next/head";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
        <title>{`${siteConfig.name} - ${siteConfig.description}`}</title>
      </head>

      <body
        className={`${outfit.variable} antialiased font-sans bg-background`}
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
