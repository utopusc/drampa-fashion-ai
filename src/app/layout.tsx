"use client";

import { LandingNavbar } from "@/components/sections/landing-navbar";
import { siteConfig } from "@/lib/config";
import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { usePathname } from "next/navigation";
import FashnKeyManager from "@/components/FashnKeyManager";

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
  const isCreate = pathname?.startsWith("/create");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{`${siteConfig.name} - ${siteConfig.description}`}</title>
      </head>

      <body
        className={`${outfit.variable} antialiased font-sans bg-background`}
      >
        <Providers>
          <FashnKeyManager />
          <div className="relative">
            {!isDashboard && !isCreate && (
              <LandingNavbar />
            )}
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
