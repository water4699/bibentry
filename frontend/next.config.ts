import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  transpilePackages: ['@zama-fhe/relayer-sdk', 'ethers'],
};

export default nextConfig;
