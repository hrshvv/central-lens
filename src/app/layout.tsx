import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
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
      lang="hi"
      className={`${notoDevanagari.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-devanagari text-gray-900 bg-white selection:bg-red-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
