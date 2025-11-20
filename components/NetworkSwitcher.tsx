"use client";

import { useChainId, useSwitchChain } from "wagmi";

export const NetworkSwitcher = () => {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const isCorrectNetwork = chainId === 31337;

  if (isCorrectNetwork) {
    return null; // Don't show if already on correct network
  }

  const handleSwitchToHardhat = async () => {
    try {
      await switchChain({ chainId: 31337 });
    } catch (error) {
      console.error('Failed to switch to Hardhat network:', error);
      alert('Failed to switch to Hardhat network. Please add it manually in MetaMask. See instructions below.');
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <strong>Network Warning:</strong> You are connected to{" "}
            {chainId === 1 ? "Ethereum Mainnet" : `Chain ID ${chainId}`}.
            This app requires the local Hardhat network (Chain ID 31337).
          </p>
          <p className="text-sm text-yellow-600 mt-1">
            <strong>Make sure Hardhat node is running:</strong> Use `npx hardhat node --fhevm` in the project root.
          </p>
          <div className="mt-2">
            <button
              onClick={handleSwitchToHardhat}
              disabled={isPending}
              className="px-3 py-1.5 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-sm hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Switching..." : "Switch to Hardhat Network"}
            </button>
          </div>
          <div className="mt-2 text-xs text-yellow-600">
            <p><strong>To add Hardhat network manually in MetaMask:</strong></p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Open MetaMask extension</li>
              <li>Click network dropdown → &ldquo;Add network&rdquo;</li>
              <li>Add these details:</li>
              <ul className="list-disc list-inside ml-4">
                <li>Network Name: Hardhat</li>
                <li>RPC URL: http://127.0.0.1:8545</li>
                <li>Chain ID: 31337</li>
                <li>Currency Symbol: ETH</li>
              </ul>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
