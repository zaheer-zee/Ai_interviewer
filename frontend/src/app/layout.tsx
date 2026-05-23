import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interview & Communication Coach",
  description: "Highly configurable real-time Voice AI Interview simulator and English Communication Coach powered by Gemini 1.5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} font-sans min-h-full flex flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
