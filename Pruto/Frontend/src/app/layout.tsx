// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '../components/providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pruto - Your Next Generation E-commerce Platform",
  description: "Pruto is a modern e-commerce platform that offers a seamless shopping experience with advanced features like AI-driven recommendations, secure payments, and real-time inventory management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname();
  // const hideNavAndFooter = pathname === '/checkout';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Providers>
          {/* The children prop of RootLayout will be passed to Providers */}
          {children}
      </Providers>
      </body>
    </html>
  );
}
