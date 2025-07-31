import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PORT: '3080'
  },
  images: {
    domains: ['images.unsplash.com']
  }
};

export default nextConfig;
