import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

<Toaster
  toastOptions={{
    position: "top-center",
    duration: 3000,
    style: { fontSize: "14px" },
    success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
    error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
  }}
/>


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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
