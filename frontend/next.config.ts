import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static optimization completely to avoid wagmi context issues
  output: 'standalone',
  trailingSlash: false,
  // Disable Turbopack to avoid workspace root issues
  experimental: {
    turbopack: false,
  },
  webpack: (config) => {
    // Ensure TypeScript files are properly resolved
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs'];

    return config;
  },
  // Experimental features compatible with Turbopack
  headers() {
    // Required by FHEVM but compatible with Base Account SDK
    return Promise.resolve([
      {
        source: '/',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]);
  }
};

export default nextConfig;
