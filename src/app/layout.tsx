import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, EB_Garamond, Bodoni_Moda, Pinyon_Script, Marcellus } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  weight: "400",
  subsets: ["latin"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chan & Jim — Wedding",
  description: "Wedding Invitation for Chan & Jim",
};

export const viewport: Viewport = {
  themeColor: "#faf5ff",
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
      className={`${geistSans.variable} ${playfair.variable} ${bodoni.variable} ${pinyon.variable} ${marcellus.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf5ff]">
        {children}
      </body>
    </html>
  );
}
