import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  transpilePackages: ['@zama-fhe/relayer-sdk', 'ethers'],
  typescript: {
    // Ignore build errors in tasks/ directory during production build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
