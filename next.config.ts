import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PORT: '3080'
  },
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remove serverExternalPackages as it can cause issues with file system operations
  // serverExternalPackages: ['fs', 'path'],

  // Ensure API routes work in production
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: [],
};

export default nextConfig;
