"use client";

import { AthleteRegistrationDemo } from "./AthleteRegistrationDemo";
import { NetworkSwitcher } from "./NetworkSwitcher";

export const HomePage = () => {
  return (
    <main className="min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-bounce">🏃‍♂️</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 animate-pulse">⚽</div>
        <div className="absolute bottom-40 left-20 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>🏊‍♀️</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>🥇</div>
        <div className="absolute top-1/2 left-1/4 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}>🏆</div>
      </div>

      <div className="relative z-10 flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0 py-8">
        <NetworkSwitcher />
        <AthleteRegistrationDemo />
      </div>
    </main>
  );
};
