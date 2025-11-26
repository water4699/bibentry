"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { UseAthleteRegistrationReturnType } from "../hooks/useAthleteRegistration";

interface AthleteDataViewerProps {
  athleteRegistration: UseAthleteRegistrationReturnType;
}

export const AthleteDataViewer = ({ athleteRegistration }: AthleteDataViewerProps) => {

  // Add global error handler for debugging
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("🚨 GLOBAL ERROR:", event.error);
      console.error("🚨 Error message:", event.message);
      console.error("🚨 Error stack:", event.error?.stack);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("🚨 UNHANDLED PROMISE REJECTION:", event.reason);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const { address, isConnected, chainId } = useAccount();
  const [hasMounted, setHasMounted] = useState(false);
  const [hasInitialRefresh, setHasInitialRefresh] = useState(false);

  // Use the passed athlete registration hook instance
  const {
    isRegistered,
    athleteInfo,
    clearAthleteInfo,
    isDecrypting,
    canDecrypt,
    decryptAthleteInfo,
    refreshAthleteInfo,
    canRefresh,
    isRefreshing,
    message,
    error,
  } = athleteRegistration;

  // Debug logging for decrypt button state (only log when state actually changes)
  useEffect(() => {
    console.log("🔓 AthleteDataViewer state updated - isRegistered:", isRegistered);
  }, [isRegistered]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Only refresh when component mounts and has basic requirements (only once)
  useEffect(() => {
    if (hasMounted && isConnected && address && canRefresh && !isRefreshing && !hasInitialRefresh) {
      console.log("🔄 AthleteDataViewer initial refresh");
      setHasInitialRefresh(true);
      refreshAthleteInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted, isConnected, address]); // Removed refreshAthleteInfo and other unstable deps

  if (!hasMounted) {
    return (
      <div className="rounded-lg bg-white border-2 border-black p-8 text-center">
        <p className="text-lg text-gray-600">Loading athlete data...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="rounded-lg bg-white border-2 border-black p-8 text-center">
        <p className="text-lg text-gray-600">Please connect your wallet to view your athlete data.</p>
      </div>
    );
  }

  const handleDecryptData = async () => {
    console.log("🔓 Decrypt button clicked!");
    console.log("🔓 canDecrypt:", canDecrypt);
    console.log("🔓 athleteInfo exists:", !!athleteInfo);
    console.log("🔓 chainId:", chainId);

    if (!canDecrypt) {
      console.log("🔓 Cannot decrypt - canDecrypt is false");
      alert("Cannot decrypt data at this time");
      return;
    }

    try {
      console.log("🔓 Calling decryptAthleteInfo...");
      await decryptAthleteInfo();
      console.log("🔓 decryptAthleteInfo completed successfully");
    } catch (error) {
      console.error("Decryption error:", error);
      alert(`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleRefreshData = async () => {
    if (!canRefresh) {
      alert("Cannot refresh data at this time");
      return;
    }

    try {
      await refreshAthleteInfo();
    } catch (error) {
      console.error("Refresh error:", error);
      alert(`Refresh failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };


  return (
    <div className="space-y-6 fade-in">
      {/* Status Information */}
      <div className="data-viewer-card">
        <h3 className="data-viewer-title">📊 Registration Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-secondary text-sm">Wallet Address</p>
            <p className="font-mono text-sm break-all">{address}</p>
          </div>
          <div>
            <p className="text-secondary text-sm">Registration Status</p>
            <p className={`font-semibold ${isRegistered ? "text-green-600" : "text-red-600"}`}>
              {isRegistered ? "Registered" : "Not Registered"}
            </p>
          </div>
        </div>

        {isRegistered && athleteInfo && (
          <div className="mt-4">
            <p className="text-secondary text-sm">Registration Timestamp</p>
            <p className="font-mono text-sm">
              {new Date(Number(athleteInfo.registrationTimestamp) * 1000).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isRegistered && athleteInfo && (
        <div className="data-viewer-card">
          <h3 className="data-viewer-title">⚡ Actions</h3>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={handleDecryptData}
              className="btn-primary"
              disabled={!canDecrypt || isDecrypting}
            >
              {isDecrypting ? "🔓 Decrypting..." : "🔓 Decrypt My Data"}
            </button>
            <button
              onClick={handleRefreshData}
              className="btn-secondary"
              disabled={!canRefresh || isRefreshing}
            >
              {isRefreshing ? "🔄 Refreshing..." : "🔄 Refresh Data"}
            </button>
          </div>
        </div>
      )}

      {/* Status messages */}
      {message && (
        <div className={`message ${error ? 'message-error' : 'message-success'}`}>
          {error ? '❌' : '✅'} {message}
        </div>
      )}

      {/* Decrypted Data Display */}
      {clearAthleteInfo && (
        <div className="data-viewer-card">
          <h3 className="data-viewer-title">🏆 Decrypted Athlete Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="data-item">
              <p className="data-label">👤 Name</p>
              <p className="data-value">{clearAthleteInfo.name}</p>
            </div>
            <div className="data-item">
              <p className="data-label">🎂 Age</p>
              <p className="data-value">{clearAthleteInfo.age.toString()} years</p>
            </div>
            <div className="data-item">
              <p className="data-label">📞 Contact</p>
              <p className="data-value">{clearAthleteInfo.contact.toString()}</p>
            </div>
            <div className="data-item">
              <p className="data-label">🏃 Sport Category</p>
              <p className="data-value">
                {['🏃‍♂️ Individual', '⚽ Team', '🏊‍♂️ Endurance', '🥊 Combat', '🏋️‍♂️ Other'][clearAthleteInfo.sportCategory]}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-secondary text-sm">Registration Timestamp</p>
              <p className="font-mono text-sm">
                {new Date(Number(clearAthleteInfo.registrationTimestamp) * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
