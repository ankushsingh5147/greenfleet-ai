import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GREENFLEET AI — Quantum-Inspired Fuel Prediction & Green Fleet Optimization",
  description:
    "AI-powered maritime decision support for lower fuel consumption, operating cost, and lifecycle greenhouse-gas emissions using Quantum-Inspired Evolutionary Algorithms.",
  keywords: [
    "GREENFLEET AI",
    "Maritime Decarbonization",
    "Quantum-Inspired Evolutionary Algorithm",
    "Fuel Consumption Prediction",
    "Green Fleet Optimization",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
