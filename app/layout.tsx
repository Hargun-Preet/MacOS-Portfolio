import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsProvider } from "@/components/Settings/SettingsContext";
import ClientLayoutWrapper from "./ClientWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"]
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hargun's MacOS",
  description: "Mac OS themed Web Portfolio built using Next.js, React, TypeScript and Tailwind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap');
        </style>
      </head>
      <SettingsProvider>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
        </ThemeProvider>
      </body>
      </SettingsProvider>
    </html>
  );
}
