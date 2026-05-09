import type { Metadata } from "next";
import { Inter, Orbitron, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  variable: "--font-rajdhani",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signal to shell",
  description: "A high-fidelity, cyberpunk-themed educational platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <div className="fixed inset-0 crt-overlay"></div>
        <div className="fixed inset-0 scanline-effect pointer-events-none z-50"></div>
        {children}
      </body>
    </html>
  );
}
