import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ClientLayout } from "../components/ClientLayout";
import ErrorBoundary from "../components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Biblock Entry - Athlete Registration",
  description: "Encrypted athlete registration system using FHEVM for privacy protection",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen text-foreground antialiased`}>
        <ErrorBoundary>
          <Providers>
            <ClientLayout>
              {children}
            </ClientLayout>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
