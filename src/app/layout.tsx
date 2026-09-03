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
  title: "Chan & Jim — Wedding Celebration",
  description: "Join us in celebrating our holy matrimony on Friday, October 30, 2026 at GracePoint Church, Kikuyu. Clothed in Faith.",
  openGraph: {
    title: "Chan & Jim — Wedding Celebration",
    description: "Friday, October 30, 2026 • GracePoint Church, Kikuyu",
    url: "https://dchans-safespace.vercel.app",
    images: [
      {
        url: "https://dchans-safespace.vercel.app/C&J.jpeg",
        width: 1200,
        height: 630,
        alt: "Chan & Jim Wedding Invitation",
      },
    ],
  },
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
