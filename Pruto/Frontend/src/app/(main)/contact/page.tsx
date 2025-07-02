"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User, AtSign } from 'lucide-react';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // Simulate toast notification
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            content: 'support@pruto.com',
            description: 'Drop us a line anytime',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Phone,
            title: 'Phone',
            content: '+1 (123) 456-7890',
            description: 'Call us for immediate help',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            icon: MapPin,
            title: 'Address',
            content: '123 E-commerce Lane',
            description: 'Retail City, State 98765',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            content: 'Mon-Fri: 9AM-6PM',
            description: 'Sat: 10AM-4PM, Sun: Closed',
            gradient: 'from-orange-500 to-red-500'
        }
    ];

    const stats = [
        { number: '24/7', label: 'Support Available', icon: Clock },
        { number: '< 2hrs', label: 'Response Time', icon: MessageSquare },
        { number: '99.9%', label: 'Customer Satisfaction', icon: User },
        { number: '50K+', label: 'Happy Customers', icon: Mail }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
                <div className="absolute top-20 left-20 w-60 h-60 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{animationDelay: '6s'}}></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 cursor-default">
                        Contact Us
                    </h1>
                    <div className="relative inline-block mb-6">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text transition-all duration-500 cursor-default">
                            Premium Support Experience
                        </h2>
                        <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:w-full transition-all duration-700 group-hover:w-full"></div>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Experience world-class support with our dedicated team. We're here to help you succeed with personalized assistance and rapid response times.
                    </p>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="backdrop-blur-md bg-white/20 rounded-3xl p-6 text-center hover:scale-105 hover:rotate-1 hover:bg-white/30 transition-all duration-500 shadow-lg hover:shadow-2xl group cursor-default"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                                {stat.number}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="backdrop-blur-md bg-white/20 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500">
                            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Get In Touch
                            </h2>
                            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                                Ready to elevate your experience? Our premium support team is standing by to provide you with exceptional service and personalized solutions.
                            </p>
                            
                            <div className="grid gap-6">
                                {contactInfo.map((info, index) => (
                                    <div 
                                        key={index}
                                        className="group backdrop-blur-sm bg-white/30 rounded-2xl p-6 hover:scale-105 hover:bg-white/40 transition-all duration-300 cursor-default"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <info.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 text-lg mb-1">
                                                    {info.title}
                                                </h3>
                                                <p className="text-gray-700 font-medium mb-1">
                                                    {info.content}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    {info.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Premium Features */}
                        <div className="backdrop-blur-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/20 shadow-lg">
                            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Why Choose Our Support?
                            </h3>
                            <div className="space-y-4">
                                {[
                                    'Lightning-fast response times under 2 hours',
                                    'Dedicated premium support specialists',
                                    'Multi-channel support (email, phone, chat)',
                                    '99.9% customer satisfaction guarantee'
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3 group">
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="backdrop-blur-md bg-white/20 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500">
                        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Send Us a Message
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Your Name
                                    </label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        className="w-full p-4 backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/40 transition-all duration-300 hover:bg-white/35" 
                                        required 
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                        <AtSign className="w-4 h-4 inline mr-2" />
                                        Your Email
                                    </label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        className="w-full p-4 backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/40 transition-all duration-300 hover:bg-white/35" 
                                        required 
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div className="group">
                                <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    <MessageSquare className="w-4 h-4 inline mr-2" />
                                    Subject
                                </label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    name="subject" 
                                    value={formData.subject} 
                                    onChange={handleChange} 
                                    className="w-full p-4 backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/40 transition-all duration-300 hover:bg-white/35" 
                                    required 
                                    placeholder="What can we help you with?"
                                />
                            </div>
                            
                            <div className="group">
                                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Message
                                </label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    rows={6} 
                                    className="w-full p-4 backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/40 transition-all duration-300 hover:bg-white/35 resize-none" 
                                    required 
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                            >
                                <Send className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                <span>Send Message</span>
                            </button>
                        </div>
                        
                        <div className="mt-8 p-6 backdrop-blur-sm bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-2xl border border-green-200/20">
                            <p className="text-center text-gray-700 text-sm">
                                <span className="font-semibold text-green-600">✓ Secure:</span> Your information is protected with enterprise-grade encryption
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center backdrop-blur-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-12 border border-white/20">
                    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Need Immediate Assistance?
                    </h3>
                    <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                        For urgent matters, don't hesitate to call our priority support line. Our premium support specialists are ready to help you immediately.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="tel:+11234567890"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 space-x-2"
                        >
                            <Phone className="w-5 h-5" />
                            <span>Call Now</span>
                        </a>
                        <a 
                            href="mailto:support@pruto.com"
                            className="inline-flex items-center px-8 py-4 backdrop-blur-sm bg-white/30 text-gray-700 rounded-2xl font-semibold hover:bg-white/40 hover:scale-105 transition-all duration-300 space-x-2 border border-white/20"
                        >
                            <Mail className="w-5 h-5" />
                            <span>Email Us</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;