import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // fs: false,
  images: {
    domains: ['images.unsplash.com'], 
  },
};

export default nextConfig;