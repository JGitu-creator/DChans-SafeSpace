import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, EB_Garamond, Satisfy } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { SupabaseProvider } from "@/components/SupabaseProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DChan's Safespace",
  description: "Chantal Hadassah's Biblical Best Friend App",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} ${garamond.variable} ${satisfy.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <SupabaseProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
