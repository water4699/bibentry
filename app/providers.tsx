"use client";

import type { ReactNode } from "react";
import { WagmiProvider, http } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage";
import { MetaMaskProvider } from "@/hooks/metamask/useMetaMaskProvider";
import { MetaMaskEthersSignerProvider } from "@/hooks/metamask/useMetaMaskEthersSigner";

const queryClient = new QueryClient();

const hardhatChain = {
  id: 31337,
  name: "Hardhat",
  network: "hardhat",
  nativeCurrency: { name: "Hardhat ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_LOCAL_RPC ?? "http://127.0.0.1:8545"],
    },
  },
} as const;

export const wagmiConfig = getDefaultConfig({
  appName: "Biblock Entry - Athlete Registration",
  projectId: 'ef3325a718834a2b1b4134d3f520933d', // WalletConnect Project ID
  chains: [hardhatChain, sepolia], // Include both local and testnet
  ssr: false, // Disable SSR to prevent wagmi context issues
  transports: {
    [hardhatChain.id]: http(hardhatChain.rpcUrls.default.http[0]),
    [sepolia.id]: http(`https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990`), // Infura endpoint
  },
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        injectedWallet,
        // walletConnectWallet, // Temporarily disabled to avoid network issues
      ],
    },
  ], // Use custom wallets without Coinbase
});

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <MetaMaskProvider>
      <MetaMaskEthersSignerProvider initialMockChains={{ 31337: "http://127.0.0.1:8545" }}>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              locale="en"
              modalSize="compact"
              appInfo={{
                appName: 'Biblock Entry - Athlete Registration System',
                learnMoreUrl: 'http://localhost:3000',
              }}
              showRecentTransactions={false}
              initialChain={hardhatChain.id} // Start with Hardhat network
            >
        <InMemoryStorageProvider>{children}</InMemoryStorageProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
      </MetaMaskEthersSignerProvider>
    </MetaMaskProvider>
  );
}
