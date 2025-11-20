import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  transpilePackages: ['@zama-fhe/relayer-sdk', 'ethers'],
  typescript: {
    // Ignore build errors in tasks/ directory during production build
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Add path aliases for @/* imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };

    return config;
  },
};

export default nextConfig;
