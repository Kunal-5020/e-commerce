'use client';

import React, { useState, useEffect } from 'react';

const Custom404Page = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const popularCategories = [
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home & Garden', icon: '🏠' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Books', icon: '📚' },
    { name: 'Beauty', icon: '💄' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative pb-10">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-1000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Interactive cursor follower */}
      <div
        className="fixed w-6 h-6 bg-purple-400/30 rounded-full pointer-events-none z-50 transition-transform duration-200 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: isHovering ? 'scale(2)' : 'scale(1)'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* 404 Number with glassmorphism effect */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse-slow">
            404
          </div>
          <div className="absolute inset-0 text-8xl md:text-9xl font-black text-white/5 blur-sm">
            404
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-2xl mx-auto space-y-6 backdrop-blur-sm bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Oops! Page Not Found
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              It looks like the page you're looking for has wandered off into the digital void. 
              Don't worry though – our products are still here waiting for you!
            </p>
          </div>

          {/* Pruto branding */}
          <div className="flex items-center justify-center space-x-3 my-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pruto
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <span className="relative flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Go Home</span>
              </span>
            </button>

            <button
              className="group px-8 py-4 border-2 border-purple-400/50 rounded-full font-semibold text-purple-300 hover:bg-purple-400/10 hover:border-purple-400 transform hover:scale-105 transition-all duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search Products</span>
              </span>
            </button>
          </div>

          {/* Popular categories */}
          <div className="mt-12 space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">
              Or explore our popular categories:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {popularCategories.map((category, index) => (
                <button
                  key={index}
                  className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                      {category.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                onFocus={() => setIsHovering(true)}
                onBlur={() => setIsHovering(false)}
              />
              <button className="absolute right-2 top-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-12 text-center text-gray-400 max-w-md mx-auto">
          <p className="text-sm">
            Still can't find what you're looking for? 
            <button className="text-purple-400 hover:text-purple-300 underline ml-1 transition-colors duration-300">
              Contact our support team
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Custom404Page;