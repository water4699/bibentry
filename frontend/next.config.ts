import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  transpilePackages: ['@zama-fhe/relayer-sdk', 'ethers'],
  webpack: (config) => {
    // Ensure proper module resolution for relative imports
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json', ...config.resolve.extensions];

    // Add alias for better module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },
};

export default nextConfig;
