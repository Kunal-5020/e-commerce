// components/providers.tsx
'use client';

import React from 'react';
import { AuthProvider } from '../lib/authContext';
import { CartProvider } from '../lib/cartContext';
import { WishlistProvider } from '../lib/wishlistContext';
import Navbar from './Navbar';
import Footer from './Footer0';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
     const pathname = usePathname();
        // Define paths where Navbar and Footer should be hidden
        const hideNavAndFooter = pathname === '/checkout';

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
         <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: { fontSize: "20px" },
            success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
           {!hideNavAndFooter && <Navbar />}
          {children}
          {!hideNavAndFooter && <Footer />}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default Providers;
