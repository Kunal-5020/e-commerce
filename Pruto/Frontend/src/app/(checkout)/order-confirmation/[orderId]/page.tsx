// app/order-confirmation/[orderId]/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchWithAuth, BASE_API_URL } from '../../../../lib/api';
import { useAuth } from '../../../../lib/authContext';
import toast from 'react-hot-toast'; // Import toast

interface OrderItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        // Add other product fields that might be populated
    };
    name: string;
    quantity: number;
    price: number;
    selectedSize?: string;
    selectedColor?: { name: string; hexCode: string };
}

interface Order {
    _id: string;
    user: string; // User ID
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentStatus: string;
    orderStatus: string;
    trackingNumber?: string;
    paymentMethod?: string;
    createdAt: string;
    updatedAt: string;
}

const OrderConfirmationPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const orderId = params.orderId as string; // Get orderId from URL params
    const { mongoUser } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [animateIn, setAnimateIn] = useState<boolean>(false);
    let toastShown = false;

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || typeof orderId !== 'string') {
                setLoading(false);
                return;
            }
            if (!mongoUser) { // Ensure user is logged in to fetch their order
                router.push('/login');
                return;
            }
            try {
                const data: Order = await fetchWithAuth(`${BASE_API_URL}/orders/${orderId}`);
                setOrder(data);
                // Trigger animation after data loads
                setTimeout(() => setAnimateIn(true), 100);
            } catch (error: any) {
                console.error('Error fetching order details:', error);
                if (!toastShown) {
                    toast.error(`Failed to load order details: ${error.message}`);
                    toastShown = true;
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, mongoUser, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-xl text-gray-600 font-medium">Loading your order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'paid':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'processing':
                return 'text-blue-600 bg-blue-100';
            case 'shipped':
                return 'text-purple-600 bg-purple-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Success Header */}
                <div className={`text-center mb-8 transform transition-all duration-700 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-pulse">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        Order Confirmed!
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        🎉 Thank you for your purchase! Your order has been placed successfully and we're preparing it for shipment.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-700 delay-200 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <h2 className="text-3xl font-bold mb-2">Order Details</h2>
                        <p className="text-blue-100">Here's everything you need to know about your order</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Order Info Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Order ID</p>
                                        <p className="text-lg font-semibold text-gray-800 font-mono">{order._id}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                                        <p className="text-2xl font-bold text-gray-800">${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Payment Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Order Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Shipping Address</h3>
                            </div>
                            <div className="text-gray-700 leading-relaxed">
                                <p className="font-medium">{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                <p className="font-medium">{order.shippingAddress.country}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Items Ordered</h3>
                            </div>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={item._id} className={`flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 delay-${index * 100} ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-lg">{item.name}</h4>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                                {item.selectedSize && (
                                                    <span className="text-sm text-gray-500">Size: {item.selectedSize}</span>
                                                )}
                                                {item.selectedColor && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-500">Color:</span>
                                                        <div 
                                                            className="w-4 h-4 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: item.selectedColor.hexCode }}
                                                        ></div>
                                                        <span className="text-sm text-gray-500">{item.selectedColor.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex flex-col sm:flex-row gap-4 pt-6 transform transition-all duration-700 delay-500 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <button
                                onClick={() => router.push('/user-profile?tab=orders')}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>View My Orders</span>
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="flex-1 bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>Continue Shopping</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className={`text-center mt-8 transform transition-all duration-700 delay-700 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <p className="text-gray-600">
                        📧 You'll receive an email confirmation shortly with tracking information.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;