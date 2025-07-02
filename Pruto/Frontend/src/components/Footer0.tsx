'use client';
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart, Shield, Award, Zap } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900/90 to-indigo-900 text-white overflow-hidden">
            {/* Enhanced animated background elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-6000"></div>
            </div>

            {/* Glassmorphism container with enhanced backdrop blur */}
            <div className="relative z-10 backdrop-blur-xl bg-white/5 border-t border-white/10">
                <div className="container mx-auto px-8 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Enhanced Brand Section */}
                        <div className="space-y-8">
                            <div className="group cursor-pointer">
                                <div className="relative">
                                    <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-all duration-300">
                                        Pruto
                                    </h3>
                                    <p className="text-sm text-purple-300 font-medium mb-4 group-hover:text-pink-300 transition-colors duration-300">
                                        Premium Store
                                    </p>
                                    <div className="w-16 h-1.5 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-full mb-6 group-hover:w-24 group-hover:h-2 transition-all duration-500 shadow-lg shadow-purple-500/50"></div>
                                </div>
                            </div>
                            
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    Your premium destination for exceptional products and unmatched customer experience.
                                </p>
                                
                                {/* Premium features */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-green-300 font-medium">Secure & Trusted</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                                            <Award className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-blue-300 font-medium">Premium Quality</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-purple-300 font-medium">Fast Delivery</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Quick Links */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-white mb-8 relative group">
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Quick Links
                                </span>
                                <div className="absolute -bottom-3 left-0 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:w-20 transition-all duration-300"></div>
                            </h3>
                            
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                                <ul className="space-y-4">
                                    {[
                                        { href: "/", label: "Home", gradient: "from-purple-400 to-pink-400" },
                                        { href: "/products", label: "Products", gradient: "from-pink-400 to-rose-400" },
                                        { href: "/about", label: "About Us", gradient: "from-blue-400 to-cyan-400" },
                                        { href: "/contact", label: "Contact Us", gradient: "from-green-400 to-emerald-400" }
                                    ].map((link, index) => (
                                        <li key={index} className="group">
                                            <Link 
                                                href={link.href} 
                                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-105"
                                            >
                                                <div className={`w-2 h-2 bg-gradient-to-r ${link.gradient} rounded-full opacity-70 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300`}></div>
                                                <span className="text-gray-300 group-hover:text-white font-medium relative">
                                                    {link.label}
                                                    <div className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r ${link.gradient} rounded-full group-hover:w-full transition-all duration-300`}></div>
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Enhanced Customer Service */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-white mb-8 relative group">
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Support
                                </span>
                                <div className="absolute -bottom-3 left-0 w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full group-hover:w-20 transition-all duration-300"></div>
                            </h3>
                            
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                                <ul className="space-y-4">
                                    {[
                                        { href: "#", label: "FAQ", gradient: "from-blue-400 to-cyan-400" },
                                        { href: "#", label: "Shipping & Returns", gradient: "from-cyan-400 to-teal-400" },
                                        { href: "#", label: "Privacy Policy", gradient: "from-teal-400 to-green-400" },
                                        { href: "#", label: "Terms of Service", gradient: "from-green-400 to-emerald-400" }
                                    ].map((link, index) => (
                                        <li key={index} className="group">
                                            <a 
                                                href={link.href} 
                                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-105"
                                            >
                                                <div className={`w-2 h-2 bg-gradient-to-r ${link.gradient} rounded-full opacity-70 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300`}></div>
                                                <span className="text-gray-300 group-hover:text-white font-medium relative">
                                                    {link.label}
                                                    <div className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r ${link.gradient} rounded-full group-hover:w-full transition-all duration-300`}></div>
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Enhanced Contact Section */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-white mb-8 relative group">
                                <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                                    Connect
                                </span>
                                <div className="absolute -bottom-3 left-0 w-12 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full group-hover:w-20 transition-all duration-300"></div>
                            </h3>
                            
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20">
                                <div className="space-y-6">
                                    {/* Contact items */}
                                    <div className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-purple-500/30">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium">Email</p>
                                            <p className="text-white font-semibold group-hover:text-purple-300 transition-colors duration-300">support@pruto.com</p>
                                        </div>
                                    </div>

                                    <div className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-500/30">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium">Phone</p>
                                            <p className="text-white font-semibold group-hover:text-blue-300 transition-colors duration-300">+1 (123) 456-7890</p>
                                        </div>
                                    </div>

                                    <div className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-green-500/30">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium">Address</p>
                                            <p className="text-white font-semibold group-hover:text-green-300 transition-colors duration-300">123 Premium St.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Social Media */}
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-gray-400 text-sm font-medium mb-6">Follow Our Journey</p>
                                    <div className="flex space-x-4">
                                        {[
                                            { name: "Twitter", gradient: "from-blue-400 to-cyan-400", icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" },
                                            { name: "Instagram", gradient: "from-pink-400 to-rose-500", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                                            { name: "LinkedIn", gradient: "from-blue-600 to-blue-500", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }
                                        ].map((social, index) => (
                                            <a
                                                key={index}
                                                href="#"
                                                className={`group w-14 h-14 bg-gradient-to-r ${social.gradient} rounded-2xl flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-current/30`}
                                            >
                                                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d={social.icon} />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Bottom Bar */}
                <div className="border-t border-white/20 backdrop-blur-xl bg-white/5">
                    <div className="container mx-auto px-8 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-gray-300">
                                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                                    <span className="font-medium">&copy; {new Date().getFullYear()} Pruto. All rights reserved.</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-8 text-sm">
                                <div className="flex items-center space-x-2 text-gray-300 hover:text-pink-300 transition-all duration-300 cursor-pointer group">
                                    <Heart className="w-4 h-4 group-hover:scale-110 group-hover:text-red-400 transition-all duration-300" />
                                    <span className="font-medium">Made with Love</span>
                                </div>
                                <span className="text-gray-400 hover:text-purple-300 transition-colors duration-300 cursor-pointer font-medium">Privacy</span>
                                <span className="text-gray-400 hover:text-purple-300 transition-colors duration-300 cursor-pointer font-medium">Terms</span>
                                <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                                    Premium
                                </div>
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
                .animation-delay-6000 {
                    animation-delay: 6s;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </footer>
    );
};

export default Footer;