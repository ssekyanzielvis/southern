import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Notification from "@/components/Notification";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Southern Organization - Making a Difference",
  description: "Community development and social impact organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen`}>
        <AnalyticsTracker />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Notification />
      </body>
    </html>
  );
}
