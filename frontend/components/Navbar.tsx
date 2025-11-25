"use client";

import { useEffect, useState } from "react";

export const Navbar = () => {
  const [ConnectButtonComponent, setConnectButtonComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Dynamically import ConnectButton to ensure wagmi context is ready
    import("@rainbow-me/rainbowkit").then((mod) => {
      setConnectButtonComponent(() => mod.ConnectButton);
    }).catch((error) => {
      console.error("Failed to load ConnectButton:", error);
    });
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-left">
            <div className="flex flex-col">
              <h1 className="header-title text-primary">🏆 Biblock Entry</h1>
              <span className="text-sm text-secondary">⚡ Athlete Registration Platform</span>
            </div>
          </div>
          <div className="header-right">
            {ConnectButtonComponent ? (
              <ConnectButtonComponent />
            ) : (
              <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium animate-pulse">
                Loading...
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
