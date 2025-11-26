import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  transpilePackages: ['@zama-fhe/relayer-sdk', 'ethers'],
  webpack: (config, { isServer }) => {
    // Add path aliases for @/* imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './'),
    };

    // Force Node.js style module resolution
    config.resolve.modules = ['node_modules'];

    // Ensure proper module resolution
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];

    // Disable symlinks for better compatibility
    config.resolve.symlinks = false;

    // Add explicit fallback for browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
      };
    }

    return config;
  },
};

export default nextConfig;
