import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TwitchProvider } from '@/components/providers/TwitchProvider';
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
  title: "Twitch Streamer Tracker",
  description: "Track your favorite Twitch streamers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TwitchProvider>
          {children}
        </TwitchProvider>
      </body>
    </html>
  );
}
