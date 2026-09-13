import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Central Lens | Hindi-First Digital News Platform",
  description: "Your source for the latest news in politics, sports, technology, and more. Hindi-first, video-first journalism.",
  icons: {
    icon: "https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png",
    shortcut: "https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png",
    apple: "https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
