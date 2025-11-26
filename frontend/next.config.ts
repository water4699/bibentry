import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  transpilePackages: ['@zama-fhe/relayer-sdk', 'ethers'],
  experimental: {
    webpackBuildWorker: false, // Disable webpack build worker to avoid module resolution issues
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ensure proper module resolution
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json', ...config.resolve.extensions];

    // Add fallback for modules that might not resolve correctly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
};

export default nextConfig;
