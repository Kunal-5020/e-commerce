// components/Navbar.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation
import { useAuth } from '../lib/authContext';
import { useCart } from '../lib/cartContext';
import toast from 'react-hot-toast'; // Import toast
import { signOut } from './firebase/firebaseAuth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X, Home, Smartphone, Phone, Info, Heart, Settings, Package, LogOut, ChevronDown } from 'lucide-react';

interface MobileNavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    icon?: React.ReactNode;
}

interface DropdownItemProps {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
}


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
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

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

    const DropdownItem: React.FC<DropdownItemProps> = ({ href, children, onClick, icon }) => {
    const handleClick = () => {
        onClick();
         router.push(href);
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600 transition-all duration-300 group mx-2 rounded-xl"
        >
            {icon && <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>}
            <span className="font-medium">{children}</span>
        </button>
    );
};


    
const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, children, onClick, className = '', icon }) => {
    const handleClick = () => {
        onClick();
        router.push(href);
    };

    return (
        <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-3 w-full py-4 px-4 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-2xl transition-all duration-300 font-semibold group hover:shadow-lg ${className}`}
        >
            {icon && (
                <motion.span 
                    className="transition-transform duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    {icon}
                </motion.span>
            )}
            <span>{children}</span>
        </motion.button>
    );
};

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50 transition-all duration-300">
                {/* Gradient border effect */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex justify-between items-center h-16 sm:h-18">
                        {/* Logo - Responsive sizing */}
                        <div 
                            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group transition-all duration-300 hover:scale-105" 
                            onClick={() => router.push('/')}
                        >
                            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 shadow-md sm:shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
                                {/* Animated background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                                <div className="relative overflow-hidden rounded-lg sm:rounded-xl p-0.5 sm:p-1 bg-gradient-to-r from-blue-500 to-purple-600">
                                    <Image 
                                        src="/pruto.png" 
                                        alt="Pruto Logo" 
                                        width={28} 
                                        height={28} 
                                        className="rounded-md sm:rounded-lg sm:w-10 sm:h-10"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-blue-600 transition-all duration-500">
                                    Pruto
                                </span>
                                <span className="text-xs text-gray-500 font-medium -mt-1 block lg:hidden transition-all duration-300">
                                    Premium Store
                                </span>
                            </div>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-2">
                            <NavLink href="/" icon={<Home className="w-4 h-4" />}>Home</NavLink>
                            <NavLink href="/products" icon={<Smartphone className="w-4 h-4" />}>Products</NavLink>
                            <NavLink href="/contact" icon={<Phone className="w-4 h-4" />}>Contact</NavLink>
                            <NavLink href="/about" icon={<Info className="w-4 h-4" />}>About</NavLink>
                            {currentUser && (
                                <>
                                    <NavLink href="/wishlist" icon={<Heart className="w-4 h-4" />}>Wishlist</NavLink>
                                    {isAdmin && (
                                        <NavLink href="/admin" className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-200" icon={<Settings className="w-4 h-4" />}>
                                            Admin
                                        </NavLink>
                                    )}
                                </>
                            )}
                        </div>
                        
                        {/* Right side controls */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Cart Icon */}
                            <div 
                                className="relative cursor-pointer group p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg" 
                                onClick={() => router.push('/cart')}
                            >
                                <div className="relative">
                                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-purple-600 transition-all duration-300 group-hover:scale-110" />
                                    {cartItemCount > 0 && (
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-lg animate-bounce">
                                            <span className="animate-pulse">{cartItemCount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* User Profile or Login */}
                            {currentUser ? (
                                <div className="relative" ref={userDropdownRef}>
                                    <button
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                        className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group hover:shadow-lg"
                                    >
                                        <div className="relative">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                                        </div>
                                        <div className="hidden sm:block text-left">
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                                Welcome back
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {currentUser.email?.split('@')[0]}
                                            </p>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-all duration-300 ${isUserDropdownOpen ? 'rotate-180 text-purple-600' : 'group-hover:text-purple-600'}`} />
                                    </button>
                                    
                                    {/* User Dropdown Menu */}
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl py-3 z-50 border border-white/20 animate-in slide-in-from-top-2 duration-300">
                                            {/* Header */}
                                            <div className="px-6 py-4 border-b border-gray-100/50">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center">
                                                        <User className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {currentUser.email}
                                                        </p>
                                                        <p className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full inline-block mt-1">
                                                            ✨ Premium Member
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <DropdownItem
                                                    href="/profile"
                                                    icon={<User className="w-4 h-4" />}
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    My Profile
                                                </DropdownItem>
                                                <DropdownItem
                                                    href="/profile?tab=orders"
                                                    icon={<Package className="w-4 h-4" />}
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    My Orders
                                                </DropdownItem>
                                                <div className="border-t border-gray-100/50 my-2 mx-4"></div>
                                                <button
                                                    onClick={confirmLogout}
                                                    className="flex items-center space-x-3 w-full text-left px-6 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 group mx-2 rounded-xl"
                                                >
                                                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                                    <span className="font-medium">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => router.push('/login')}
                                    className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-8 md:py-3 rounded-xl sm:rounded-2xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
                                >
                                    <span className="flex items-center space-x-1 sm:space-x-2">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm sm:text-base">Login</span>
                                    </span>
                                </button>
                            )}
                            
                            {/* Mobile Menu Button */}
                            <div className="lg:hidden">
                                <button 
                                    className="p-2 sm:p-3 rounded-xl sm:rounded-2xl text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 focus:outline-none transition-all duration-300 hover:shadow-lg"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    <motion.div
                                        animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isMobileMenuOpen ? (
                                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                        ) : (
                                            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                                        )}
                                    </motion.div>
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
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></motion.div>
                    
                    {/* Sidebar */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ 
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                            duration: 0.4
                        }}
                        className="fixed right-0 top-0 h-full w-[85vw] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/20"
                    >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 pointer-events-none"></div>
                        
                        <div className="relative p-4 sm:p-6 h-full overflow-y-auto">
                            {/* Header */}
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex justify-between items-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200/50"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm sm:text-base">P</span>
                                    </div>
                                    <div>
                                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            Menu
                                        </span>
                                        <p className="text-xs text-gray-500">Navigation</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.button>
                            </motion.div>
                            
                            {/* Navigation Links */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <MobileNavLink href="/" icon={<Home className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>
                                    Home
                                </MobileNavLink>
                                <MobileNavLink href="/products" icon={<Smartphone className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>
                                    Products
                                </MobileNavLink>
                                <MobileNavLink href="/contact" icon={<Phone className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>
                                    Contact Us
                                </MobileNavLink>
                                <MobileNavLink href="/about" icon={<Info className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>
                                    About Us
                                </MobileNavLink>
                                
                                {currentUser && (
                                    <>
                                        <motion.div 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="border-t border-gray-200/50 my-4 sm:my-6 pt-4 sm:pt-6"
                                        >
                                            <div className="flex items-center space-x-3 mb-4 px-4">
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Account</p>
                                                    <p className="text-xs text-gray-500">Manage your profile</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                        <MobileNavLink href="/wishlist" icon={<Heart className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>
                                            Wishlist
                                        </MobileNavLink>
                                        <MobileNavLink href="/profile" icon={<User className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>
                                            My Profile
                                        </MobileNavLink>
                                        <MobileNavLink href="/profile?tab=orders" icon={<Package className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>
                                            My Orders
                                        </MobileNavLink>
                                        {isAdmin && (
                                            <MobileNavLink href="/admin" icon={<Settings className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)} className="text-red-600 bg-red-50 border border-red-200">
                                                Admin Dashboard
                                            </MobileNavLink>
                                        )}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                confirmLogout();
                                            }}
                                            className="flex items-center space-x-3 w-full text-left py-3 sm:py-4 px-4 text-red-600 hover:bg-red-50 rounded-xl sm:rounded-2xl transition-all duration-300 mt-4 sm:mt-6 border border-red-200 hover:border-red-300 group"
                                        >
                                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                                <LogOut className="w-5 h-5" />
                                            </motion.div>
                                            <span className="font-semibold">Logout</span>
                                        </motion.button>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md"
                        onClick={cancelLogout}
                    ></motion.div>
                    
                    {/* Modal */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ 
                            type: 'spring',
                            stiffness: 300,
                            damping: 25
                        }}
                        className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-4 border border-white/20"
                    >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/30 rounded-2xl sm:rounded-3xl pointer-events-none"></div>
                        
                        <div className="relative text-center">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                                className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-500 to-pink-500 mb-4 sm:mb-6 shadow-lg"
                            >
                                <LogOut className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </motion.div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                                Confirm Logout
                            </h3>
                            <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
                                Are you sure you want to logout from your account?
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={cancelLogout}
                                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 font-semibold"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                                >
                                    Logout
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
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


export default Navbar;