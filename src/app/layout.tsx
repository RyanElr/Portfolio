// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import ThemeClient from "@/components/ThemeClient";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio Next.js + Tailwind",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col bg-[var(--bg)] text-[var(--fg)]`}>
        
        <ThemeClient />
        <main className="relative flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
