import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import LoadingBar from "@/components/basic/LoadingBar";
import { Suspense } from "react";
import { UIProvider } from "@/components/providers/ui-provider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HireSapien | Discover How Industry-Ready You Are",
  description:
    "Experience a real-world Junior Data Scientist simulation and receive a personalized competency report. Industry-based, 15 minutes, no preparation required.",
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
          </Suspense>
          {children}
        </UIProvider>
      </body>
    </html>
  );
}
