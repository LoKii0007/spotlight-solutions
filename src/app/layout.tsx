import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/context/AuthProvider";
import "@/css/main.css";
import "@/css/globals.css";
import ReduxWrapper from "@/context/ReduxWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotlight solutions",
  description: "Spotlight solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <AuthProvider>
          <ReduxWrapper >
            {children}
          </ReduxWrapper>
        </AuthProvider>
      </body>
      <Toaster />
    </html>
  );
}
