'use client';

import React from 'react';
import { usePathname } from 'next/navigation'; // Use usePathname for app router
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const pathname = usePathname();
    // Define paths where Navbar and Footer should be hidden
    const hideNavAndFooter = pathname === '/checkout';

    return (
        <div className="flex flex-col min-h-screen font-inter">
            {!hideNavAndFooter && <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
            {!hideNavAndFooter && <Footer />}
        </div>
    );
};

export default Layout;
