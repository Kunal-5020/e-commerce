// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from '../lib/authContext';
import { CartProvider } from '../lib/cartContext';
import LayoutWrapper from '../components/LayoutWrapper';
// import { usePathname } from 'next/navigation'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: { fontSize: "14px" },
            success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
        {/* {!hideNavAndFooter && <Navbar />} */}
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {/* <LayoutWrapper> */}
              {children}
            {/* </LayoutWrapper> */}
            <Footer />
          </CartProvider>
        </AuthProvider>
        
        {/* {!hideNavAndFooter && <Footer />} */}
      </body>
    </html>
  );
}
