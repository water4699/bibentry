import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  transpilePackages: ['@zama-fhe/relayer-sdk', 'ethers'],
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
