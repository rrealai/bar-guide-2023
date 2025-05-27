import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KeepAwake from "@/components/KeepAwake";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rreal Tacos Bar Guide",
  description: "Interactive bar guide for Rreal Tacos staff.",
  manifest: "/manifest.json",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-100`}>
        {children}
        <KeepAwake />
      </body>
    </html>
  );
} 