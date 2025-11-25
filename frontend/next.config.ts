import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static optimization completely to avoid wagmi context issues
  output: 'standalone',
  trailingSlash: false,
  // Ensure proper TypeScript resolution
  transpilePackages: ['@zama-fhe/relayer-sdk', 'ethers'],
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
