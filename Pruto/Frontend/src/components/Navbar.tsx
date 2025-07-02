// components/Navbar.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation
import { useAuth } from '../lib/authContext';
import { useCart } from '../lib/cartContext';
import toast from 'react-hot-toast'; // Import toast
import { signOut } from './firebase/firebaseAuth';
import Image from 'next/image';

const Navbar: React.FC = () => {
    const { currentUser, isAdmin } = useAuth();
    const { cartItems } = useCart();
    const router = useRouter();
    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
    // State for dropdowns and mobile menu
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    // Refs for click outside detection
    const userDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
            toast.success('Logged out successfully!');
            setIsUserDropdownOpen(false);
            setShowLogoutConfirm(false);
        } catch (error: any) {
            console.error('Error logging out:', error);
            toast.error(`Failed to log out: ${error.message}`);
        }
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(true);
        setIsUserDropdownOpen(false);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <>
            <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div 
                            className="flex items-center space-x-3 cursor-pointer group transition-transform duration-200 hover:scale-105" 
                            onClick={() => router.push('/')}
                        >
                            <div className="relative overflow-hidden rounded-xl p-1 bg-gradient-to-r from-blue-500 to-purple-600">
                                <Image 
                                    src="/pruto.png" 
                                    alt="Pruto Logo" 
                                    width={40} 
                                    height={40} 
                                    className="rounded-lg"
                                />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Pruto
                            </span>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            <NavLink href="/" icon="🏠">Home</NavLink>
                            <NavLink href="/products" icon="📱">Products</NavLink>
                            <NavLink href="/contact" icon="📞">Contact</NavLink>
                            <NavLink href="/about" icon="ℹ️">About</NavLink>
                            {currentUser && (
                                <>
                                    <NavLink href="/wishlist" icon="❤️">Wishlist</NavLink>
                                    {isAdmin && (
                                        <NavLink href="/admin" className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100" icon="⚙️">
                                            Admin
                                        </NavLink>
                                    )}
                                </>
                            )}
                        </div>
                        
                        {/* Right side controls */}
                        <div className="flex items-center space-x-3">
                            {/* Cart Icon */}
                            <div 
                                className="relative cursor-pointer group p-2 rounded-xl hover:bg-gray-100 transition-all duration-200" 
                                onClick={() => router.push('/cart')}
                            >
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
                                    </svg>
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* User Profile or Login */}
                            {currentUser ? (
                                <div className="relative" ref={userDropdownRef}>
                                    <button
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                        className="flex items-center space-x-2 p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200 group"
                                    >
                                        <div className="relative">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-all duration-200 ${isUserDropdownOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* User Dropdown Menu */}
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {currentUser.email}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Welcome back!
                                                </p>
                                            </div>
                                            <DropdownItem
                                                href="/user-profile"
                                                icon="👤"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                My Profile
                                            </DropdownItem>
                                            <DropdownItem
                                                href="/orders"
                                                icon="📦"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                My Orders
                                            </DropdownItem>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button
                                                onClick={confirmLogout}
                                                className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                                            >
                                                <span className="text-base group-hover:scale-110 transition-transform duration-200">🚪</span>
                                                <span className="font-medium">Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => router.push('/login')}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Login
                                </button>
                            )}
                            
                            {/* Mobile Menu Button */}
                            <div className="lg:hidden">
                                <button 
                                    className="p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-all duration-200"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                    
                    {/* Sidebar */}
                    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <Image src="/pruto.png" alt="Pruto" width={24} height={24} className="rounded" />
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Menu
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Navigation Links */}
                            <div className="space-y-2">
                                <MobileNavLink href="/" icon="🏠" onClick={() => setIsMobileMenuOpen(false)}>
                                    Home
                                </MobileNavLink>
                                <MobileNavLink href="/products" icon="📱" onClick={() => setIsMobileMenuOpen(false)}>
                                    Products
                                </MobileNavLink>
                                <MobileNavLink href="/contact" icon="📞" onClick={() => setIsMobileMenuOpen(false)}>
                                    Contact Us
                                </MobileNavLink>
                                <MobileNavLink href="/about" icon="ℹ️" onClick={() => setIsMobileMenuOpen(false)}>
                                    About Us
                                </MobileNavLink>
                                
                                {currentUser && (
                                    <>
                                        <div className="border-t border-gray-200 my-4 pt-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                                                Account
                                            </p>
                                        </div>
                                        <MobileNavLink href="/wishlist" icon="❤️" onClick={() => setIsMobileMenuOpen(false)}>
                                            Wishlist
                                        </MobileNavLink>
                                        <MobileNavLink href="/user-profile" icon="👤" onClick={() => setIsMobileMenuOpen(false)}>
                                            My Profile
                                        </MobileNavLink>
                                        <MobileNavLink href="/orders" icon="📦" onClick={() => setIsMobileMenuOpen(false)}>
                                            My Orders
                                        </MobileNavLink>
                                        {isAdmin && (
                                            <MobileNavLink href="/admin" icon="⚙️" onClick={() => setIsMobileMenuOpen(false)} className="text-red-600 bg-red-50">
                                                Admin Dashboard
                                            </MobileNavLink>
                                        )}
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                confirmLogout();
                                            }}
                                            className="flex items-center space-x-3 w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 mt-4 border border-red-200"
                                        >
                                            <span className="text-lg">🚪</span>
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={cancelLogout}
                    ></div>
                    
                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Confirm Logout
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to logout from your account?
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={cancelLogout}
                                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    icon?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className = '', icon }) => {
    return (
        <Link
            href={href}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium group ${className}`}
        >
            {icon && <span className="text-sm group-hover:scale-110 transition-transform duration-200">{icon}</span>}
            <span>{children}</span>
        </Link>
    );
};

interface DropdownItemProps {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
    icon?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ href, children, onClick, icon }) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 group"
        >
            {icon && <span className="text-base group-hover:scale-110 transition-transform duration-200">{icon}</span>}
            <span className="font-medium">{children}</span>
        </Link>
    );
};

interface MobileNavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    icon?: string;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, children, onClick, className = '', icon }) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center space-x-3 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group ${className}`}
        >
            {icon && <span className="text-lg group-hover:scale-110 transition-transform duration-200">{icon}</span>}
            <span>{children}</span>
        </Link>
    );
};

export default Navbar;