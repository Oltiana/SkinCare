import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/client/app-shell";
import { Providers } from "@/components/client/providers";
import { getPublicAppName } from "@/lib/server/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const luxurySerif = Cormorant_Garamond({
  variable: "--font-luxury-serif",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SkinCare",
  description: "SkinCare — authentication and admin panel on Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appName = getPublicAppName();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${luxurySerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F9F9F9] font-sans text-stone-900">
        <Providers>
          <AppShell appName={appName}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
