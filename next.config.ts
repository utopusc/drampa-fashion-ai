import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3.fal.media',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.fal.media',
        pathname: '/**',
      },
      // Also add cloudflare for avatars if needed
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
