'use client';
// components/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 backdrop-blur-sm">
                <div className="container mx-auto px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Brand Section */}
                        <div className="space-y-6">
                            <div className="group">
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 group-hover:scale-105 transition-transform duration-300">
                                    Pruto
                                </h3>
                                <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-4 group-hover:w-16 transition-all duration-300"></div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                Your one-stop shop for all your needs. Quality products, exceptional service, and unmatched customer satisfaction.
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-purple-300">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Online & Ready to Serve</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white mb-6 relative">
                                Quick Links
                                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-purple-400 rounded-full"></div>
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { href: "/", label: "Home" },
                                    { href: "/products", label: "Products" },
                                    { href: "/about", label: "About Us" },
                                    { href: "/contact", label: "Contact Us" }
                                ].map((link, index) => (
                                    <li key={index} className="group">
                                        <Link 
                                            href={link.href} 
                                            className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2 group-hover:translate-x-2"
                                        >
                                            <div className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="relative">
                                                {link.label}
                                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:w-full transition-all duration-300"></div>
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white mb-6 relative">
                                Customer Service
                                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-400 rounded-full"></div>
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { href: "#", label: "FAQ" },
                                    { href: "#", label: "Shipping & Returns" },
                                    { href: "#", label: "Privacy Policy" },
                                    { href: "#", label: "Terms of Service" }
                                ].map((link, index) => (
                                    <li key={index} className="group">
                                        <a 
                                            href={link.href} 
                                            className="text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-2 group-hover:translate-x-2"
                                        >
                                            <div className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="relative">
                                                {link.label}
                                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full group-hover:w-full transition-all duration-300"></div>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white mb-6 relative">
                                Get In Touch
                                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-pink-400 rounded-full"></div>
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Email</p>
                                        <p className="text-white font-medium">support@pruto.com</p>
                                    </div>
                                </div>

                                <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Phone</p>
                                        <p className="text-white font-medium">+1 (123) 456-7890</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="pt-4">
                                <p className="text-gray-400 text-sm mb-4">Follow Us</p>
                                <div className="flex space-x-4">
                                    {[
                                        { icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z", label: "Twitter" },
                                        { icon: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 3.95-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.69 2.11 2.95 4 2.98-1.46 1.16-3.31 1.84-5.33 1.84-.35 0-.69-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z", label: "Twitter" },
                                        { icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z", label: "Pinterest" }
                                    ].map((social, index) => (
                                        <a
                                            key={index}
                                            href="#"
                                            className="group w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                                        >
                                            <svg className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d={social.icon} />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 backdrop-blur-sm">
                    <div className="container mx-auto px-8 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="flex items-center space-x-2 text-gray-400">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                <span>&copy; {new Date().getFullYear()} Pruto. All rights reserved.</span>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                                <span className="hover:text-purple-300 transition-colors duration-300 cursor-pointer">Made with ❤️</span>
                                <span className="hover:text-purple-300 transition-colors duration-300 cursor-pointer">Privacy</span>
                                <span className="hover:text-purple-300 transition-colors duration-300 cursor-pointer">Terms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </footer>
    );
};

export default Footer;