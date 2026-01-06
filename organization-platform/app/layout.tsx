import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Notification from "@/components/Notification";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Southern Organization - Making a Difference",
  description: "Community development and social impact organization",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AnalyticsTracker />
        {children}
        <Notification />
      </body>
    </html>
  );
}
