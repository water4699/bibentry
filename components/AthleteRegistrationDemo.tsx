"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useAccount } from "wagmi";
import { AthleteRegistrationForm } from "./AthleteRegistrationForm";
import { AthleteDataViewer } from "./AthleteDataViewer";
import { useAthleteRegistration } from "@/hooks/useAthleteRegistration";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";

export const AthleteRegistrationDemo = () => {
  const { isConnected, chainId } = useAccount();

  // For local development (chainId 31337), allow registration without wallet connection
  const isLocalDevelopment = chainId === 31337;
  const effectiveIsConnected = isConnected || isLocalDevelopment || (typeof window !== 'undefined' && window.location.hostname === 'localhost');
  const { ethersSigner } = useMetaMaskEthersSigner();
  const [activeTab, setActiveTab] = useState<"register" | "view">("register");
  const [hasMounted, setHasMounted] = useState(false);

  // FHEVM setup
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const storageRef = useRef(fhevmDecryptionSignatureStorage);

  // Enable FHEVM only when user is connected and ready to use it
  const [fhevmDelayPassed, setFhevmDelayPassed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setFhevmDelayPassed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get EIP1193 provider - for local network (31337), use RPC URL string
  // For other networks, use window.ethereum
  // This ensures FHEVM can properly detect and use mock instance for local network
  const getEip1193Provider = () => {
    if (chainId === 31337) {
      // For local network, use RPC URL string to enable mock FHEVM instance
      return "http://127.0.0.1:8545";
    }
    // For other networks, use window.ethereum if available
    if (typeof window !== 'undefined' && window?.ethereum) {
      return window.ethereum;
    }
    return undefined;
  };

  const provider = getEip1193Provider();
  const fhevmEnabled = hasMounted && fhevmDelayPassed && !!provider && (isConnected || chainId === 31337 || chainId === 11155111);

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider: fhevmEnabled ? provider : undefined,
    chainId,
    initialMockChains: { 31337: "http://127.0.0.1:8545" }, // Always include mock chains
    enabled: fhevmEnabled,
  });

  // Debug logging for FHEVM status (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔍 FHEVM Debug (AthleteRegistrationDemo):', {
        fhevmEnabled,
        fhevmStatus,
        fhevmInstance: !!fhevmInstance,
        fhevmError: fhevmError?.message,
        fhevmErrorStack: fhevmError?.stack,
        fhevmErrorName: fhevmError?.name,
        fhevmErrorCode: fhevmError && 'code' in fhevmError ? (fhevmError as { code: string }).code : undefined,
        fhevmErrorFull: fhevmError,
        chainId,
        isConnected,
        hasMounted,
        fhevmDelayPassed,
        hasEthereum: !!window?.ethereum,
        provider: typeof provider === 'string' ? provider : 'window.ethereum',
        providerType: typeof provider,
        providerValue: provider
      });

      // If there's an error, log it more prominently
      if (fhevmError) {
        console.error('❌ FHEVM Initialization Error:', fhevmError);
        console.error('Error details:', {
          message: fhevmError.message,
          name: fhevmError.name,
          stack: fhevmError.stack,
          code: fhevmError && 'code' in fhevmError ? (fhevmError as { code: string }).code : undefined,
          cause: fhevmError && 'cause' in fhevmError ? (fhevmError as { cause: unknown }).cause : undefined
        });
      }
    }
  }, [fhevmEnabled, fhevmStatus, fhevmInstance, fhevmError, chainId, isConnected, hasMounted, fhevmDelayPassed, provider]);

  // Helper function to get FHEVM status message
  const getFhevmStatusMessage = () => {
    if (!fhevmEnabled) return null;

    switch (fhevmStatus) {
      case 'idle':
        return { type: 'info', message: 'FHEVM initializing...' };
      case 'loading':
        return { type: 'info', message: 'FHEVM loading...' };
      case 'ready':
        // Check if we have a minimal instance (limited functionality)
        if (fhevmInstance && typeof fhevmInstance.createEncryptedInput === 'function') {
          try {
            // Try to call a method that would fail in minimal mode
            fhevmInstance.createEncryptedInput('0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000');
            return { type: 'success', message: 'FHEVM ready for encryption/decryption' };
          } catch (e: unknown) {
            const errorMsg = e instanceof Error ? e.message : '';
            if (errorMsg.includes('not available in minimal mode')) {
              return {
                type: 'warning',
                message: 'FHEVM running in limited mode. Start Hardhat with --fhevm for full encryption/decryption',
                suggestion: 'Run: npx hardhat node --fhevm'
              };
            }
          }
        }
        return { type: 'success', message: 'FHEVM ready for encryption/decryption' };
      case 'error':
        // Check if it's the specific "Hardhat node not supported" error
        const errorMessage = fhevmError?.message || '';
        if (errorMessage.includes('Hardhat node at') && errorMessage.includes('does not support FHEVM')) {
          return {
            type: 'warning',
            message: 'Using basic FHEVM mode. For full functionality, start Hardhat node with: npx hardhat node --fhevm',
            suggestion: 'Run: npx hardhat node --fhevm'
          };
        }
        // Check for the new "could not decode result data" error
        if (errorMessage.includes('could not decode result data') && errorMessage.includes('getKmsSigners')) {
          return {
            type: 'warning',
            message: 'FHEVM contracts not found on local network. Using basic mode for compatibility',
            suggestion: 'For full FHE: npx hardhat node --fhevm'
          };
        }
        return { type: 'error', message: `FHEVM Error: ${fhevmError?.message || 'Unknown error'}` };
      default:
        return null;
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Memoize hook parameters to prevent unnecessary re-initialization
  const hookParams = useMemo(() => ({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage: storageRef,
    eip1193Provider: typeof window !== 'undefined' ? window.ethereum : undefined,
    chainId: chainId || 31337, // Default to local network
    ethersSigner: ethersSigner, // Always use ethersSigner for MetaMask popups
    sameChain: { current: () => true }, // Simplified
    sameSigner: { current: () => true }, // Simplified
  }), [fhevmInstance, ethersSigner, chainId]);

  // Only create hook instance when dependencies are ready
  const athleteRegistration = useAthleteRegistration(hookParams);

  return (
    <div className="main-content">
      <div className="content-wrapper">
        <div className="title-section">
          <h1 className="main-title">
            🏃‍♂️ Athlete Registration System 🏃‍♀️
          </h1>
          <p className="main-subtitle">
            ⚡ Secure athlete registration with encrypted personal information using Fully Homomorphic Encryption (FHE). <br />
            🔐 Your data is stored securely on the blockchain - only you can decrypt it with your private key! <br />
            🏆 Join the next generation of privacy-protected sports registration. <br />
            🏃‍♂️ 🏃‍♀️ 🏊‍♂️ 🚴‍♂️ ⚽ 🏀 🎾 🏐 🥊 🏋️‍♂️
          </p>
        </div>

        {!hasMounted ? (
          <div className="connect-card">
            <h2 className="connect-title">
              Loading...
            </h2>
            <p className="connect-subtitle">
              Initializing application
            </p>
          </div>
        ) : !effectiveIsConnected ? (
          <div className="connect-card">
            <h2 className="connect-title">
              🔗 Connect Your Wallet
            </h2>
            <p className="connect-subtitle">
              ⚡ Connect your wallet to start your secure athlete registration journey! <br />
              Choose MetaMask, WalletConnect, or any Web3 wallet to get started.
            </p>
          </div>
        ) : (
          <>
            {/* FHEVM Status Indicator */}
            {(() => {
              const statusInfo = getFhevmStatusMessage();
              if (!statusInfo) return null;

              const getBgColor = () => {
                switch (statusInfo.type) {
                  case 'success': return 'bg-green-100 border-green-500 text-green-800';
                  case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
                  case 'error': return 'bg-red-100 border-red-500 text-red-800';
                  case 'info': return 'bg-blue-100 border-blue-500 text-blue-800';
                  default: return 'bg-gray-100 border-gray-500 text-gray-800';
                }
              };

              const getIcon = () => {
                switch (statusInfo.type) {
                  case 'success': return '✅';
                  case 'warning': return '⚠️';
                  case 'error': return '❌';
                  case 'info': return 'ℹ️';
                  default: return '🔧';
                }
              };

              return (
                <div className={`mb-6 p-4 border-l-4 rounded-r-lg ${getBgColor()}`}>
                  <div className="flex items-center">
                    <span className="mr-2">{getIcon()}</span>
                    <div>
                      <p className="font-medium">{statusInfo.message}</p>
                      {statusInfo.suggestion && (
                        <p className="text-sm mt-1 opacity-90">
                          💡 <code className="bg-black bg-opacity-10 px-2 py-1 rounded text-xs">
                            {statusInfo.suggestion}
                          </code>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <button
                onClick={() => setActiveTab("register")}
                className={`tab-button ${activeTab === "register" ? "tab-button-active" : "tab-button-inactive"}`}
              >
                📝 Register Athlete
              </button>
              <button
                onClick={() => setActiveTab("view")}
                className={`tab-button ${activeTab === "view" ? "tab-button-active" : "tab-button-inactive"}`}
              >
                👁️ View My Data
              </button>
            </div>

            <div className="content-sections">
              {activeTab === "register" ? (
                <AthleteRegistrationForm athleteRegistration={athleteRegistration} />
              ) : (
                <AthleteDataViewer athleteRegistration={athleteRegistration} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
