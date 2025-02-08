import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/provider/tanstack-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/provider/auth-provider";
import { ThemeProvider } from "@/provider/theme-provider";
import { HeaderProvider } from "@/hooks/useHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TripEx",
  description:
    "Track, Save, and Enjoy—Effortless Expense Management for Every Trip!",
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <HeaderProvider>
              <TanstackProvider>{children}</TanstackProvider>
              <Toaster />
            </HeaderProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
