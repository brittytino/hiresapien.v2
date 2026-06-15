import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import LoadingBar from "@/components/basic/LoadingBar";
import RouteLoadingOverlay from "@/components/basic/RouteLoadingOverlay";
import { Suspense } from "react";
import { UIProvider } from "@/components/providers/ui-provider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hiresapien | Portal",
  description: "Secure access to the Placement Readiness Intelligence Platform",
  icons: {
    icon: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="antialiased bg-page-bg text-text-main font-sans">
        <UIProvider>
          <Suspense fallback={null}>
            <LoadingBar />
            <RouteLoadingOverlay />
          </Suspense>
          {children}
        </UIProvider>
      </body>
    </html>
  );
}
