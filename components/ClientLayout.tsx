"use client";

import { Navbar } from "./Navbar";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="flex flex-col max-w-screen-lg mx-auto pb-20">
        {children}
      </main>
    </div>
  );
};
