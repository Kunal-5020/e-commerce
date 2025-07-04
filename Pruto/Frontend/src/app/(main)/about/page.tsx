'use client';
import React from 'react';
import { Shield, Zap, Heart, Star, Award, Users, Globe, TrendingUp } from 'lucide-react';

const AboutUsPage: React.FC = () => {
    const commitments = [
        {
            icon: Shield,
            title: "Quality",
            description: "Sourcing products from trusted brands and manufacturers to ensure durability and satisfaction.",
            gradient: "from-emerald-400 to-teal-500",
            shadowColor: "shadow-emerald-500/30"
        },
        {
            icon: TrendingUp,
            title: "Style",
            description: "Staying ahead of trends to bring you the latest and most fashionable items.",
            gradient: "from-purple-400 to-pink-500",
            shadowColor: "shadow-purple-500/30"
        },
        {
            icon: Heart,
            title: "Customer Satisfaction",
            description: "Providing exceptional customer service and support, because your happiness is our priority.",
            gradient: "from-rose-400 to-pink-500",
            shadowColor: "shadow-rose-500/30"
        },
        {
            icon: Zap,
            title: "Innovation",
            description: "Continuously improving our platform and offerings to enhance your shopping experience.",
            gradient: "from-blue-400 to-cyan-500",
            shadowColor: "shadow-blue-500/30"
        }
    ];

    const stats = [
        { icon: Users, number: "50K+", label: "Happy Customers", gradient: "from-purple-400 to-pink-500" },
        { icon: Award, number: "99%", label: "Satisfaction Rate", gradient: "from-blue-400 to-cyan-500" },
        { icon: Globe, number: "100+", label: "Countries Served", gradient: "from-green-400 to-emerald-500" },
        { icon: Star, number: "4.9", label: "Average Rating", gradient: "from-yellow-400 to-orange-500" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 relative overflow-hidden">
            {/* Enhanced animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-4 sm:right-10 w-44 h-44 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/4 sm:left-1/3 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
                <div className="absolute bottom-40 right-1/4 w-36 h-36 sm:w-48 sm:h-48 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-6000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                {/* Enhanced Hero Section */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <div className="inline-block group cursor-pointer mb-6 sm:mb-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent mb-2 sm:mb-4 group-hover:scale-105 transition-all duration-500 leading-tight">
                            About Pruto
                        </h1>
                        <p className="text-lg sm:text-xl text-purple-600 font-semibold group-hover:text-pink-500 transition-colors duration-300">
                            Premium Store Experience
                        </p>
                        <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full mx-auto mt-3 sm:mt-4 group-hover:w-24 sm:group-hover:w-32 group-hover:h-1.5 sm:group-hover:h-2 transition-all duration-500 shadow-lg shadow-purple-500/50"></div>
                    </div>
                    
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                        Discover the story behind your favorite premium shopping destination
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16 lg:mb-20">
                    {stats.map((stat, index) => (
                        <div key={index} className="group">
                            <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center hover:bg-white/90 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r ${stat.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                                </div>
                                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1 sm:mb-2`}>
                                    {stat.number}
                                </div>
                                <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium leading-tight">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 max-w-5xl mx-auto shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 mb-12 sm:mb-16">
                    <div className="text-gray-700 leading-relaxed space-y-6 sm:space-y-8">
                        <div className="group">
                            <p className="text-base sm:text-lg mb-4 sm:mb-6 text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                Welcome to <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Pruto</span>, your ultimate destination for high-quality products and an unparalleled shopping experience. Founded with a passion for bringing the best of fashion, electronics, home goods, and more directly to your doorstep.
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-purple-100 hover:shadow-lg transition-all duration-300">
                            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3 sm:mb-4 flex items-center">
                                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mr-2 sm:mr-3 flex-shrink-0" />
                                Our Mission
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                Our mission is simple: to provide a seamless and enjoyable online shopping journey, offering a curated selection of products that meet our rigorous standards for quality, style, and value. We believe that shopping should be convenient, inspiring, and rewarding.
                            </p>
                        </div>

                        {/* Commitments Section */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
                                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Our Commitments</span>
                            </h2>
                            
                            <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
                                {commitments.map((commitment, index) => (
                                    <div key={index} className="group">
                                        <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:scale-105 h-full">
                                            <div className="flex items-start space-x-3 sm:space-x-4">
                                                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${commitment.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${commitment.shadowColor} flex-shrink-0`}>
                                                    <commitment.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ${commitment.gradient} bg-clip-text text-transparent`}>
                                                        {commitment.title}
                                                    </h3>
                                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                                        {commitment.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-100 hover:shadow-lg transition-all duration-300">
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                We are more than just an e-commerce platform; we are a community built around shared values of quality, style, and convenience. Thank you for choosing Pruto. We look forward to serving you and becoming your go-to online store.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Team Section */}
                <div className="text-center px-4">
                    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-500 max-w-2xl mx-auto">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/30">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Happy Shopping!</h2>
                            <div className="w-12 sm:w-16 h-1 bg-white/50 rounded-full mx-auto mb-4 sm:mb-6"></div>
                            <p className="text-lg sm:text-xl text-white/90 font-medium leading-relaxed mb-6 sm:mb-8">
                                With love and dedication,<br />
                                <span className="text-xl sm:text-2xl font-bold text-yellow-200">The Pruto Team</span>
                            </p>
                            
                            {/* Team badges */}
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-white/30">
                                    <span className="text-white/90 text-xs sm:text-sm font-medium">✨ Premium</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-white/30">
                                    <span className="text-white/90 text-xs sm:text-sm font-medium">🚀 Innovative</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-white/30">
                                    <span className="text-white/90 text-xs sm:text-sm font-medium">❤️ Customer-First</span>
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
                    50% { transform: translateY(-10px); }
                }
                
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                
                @media (max-width: 640px) {
                    .container {
                        max-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default AboutUsPage;