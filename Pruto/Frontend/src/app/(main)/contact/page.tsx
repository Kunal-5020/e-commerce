// app/contact/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState } from 'react';
import toast from 'react-hot-toast'; // Import toast

const ContactUsPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    };

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Contact Us</h1>

            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                <p className="text-gray-700 mb-6 text-center">
                    Have a question or need assistance? Feel free to reach out to us using the form below, or contact us directly.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Information</h2>
                        <p className="text-gray-700 mb-2"><strong>Email:</strong> support@pruto.com</p>
                        <p className="text-gray-700 mb-2"><strong>Phone:</strong> +1 (123) 456-7890</p>
                        <p className="text-gray-700 mb-2"><strong>Address:</strong> 123 E-commerce Lane, Retail City, State 98765, Country</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Business Hours</h2>
                        <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</p>
                        <p className="text-gray-700">Sunday: Closed</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">Your Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Your Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-gray-700 font-semibold mb-1">Subject</label>
                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-700 font-semibold mb-1">Message</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-md">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUsPage;
