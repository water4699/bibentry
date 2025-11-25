import type { NextConfig } from "next";
import * as path from "path";

const nextConfig: NextConfig = {
  // Disable static optimization completely to avoid wagmi context issues
  output: 'standalone',
  trailingSlash: false,
  // Force webpack instead of Turbopack for better module resolution
  experimental: {
    webpackBuildWorker: false, // Explicitly disable webpack worker to force traditional webpack
  },
  // Ensure proper TypeScript resolution
  transpilePackages: ['@zama-fhe/relayer-sdk', 'ethers'],
  // Use webpack directly for better compatibility
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ensure TypeScript files are properly resolved
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs'];

    // Add path aliases for better module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };

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
