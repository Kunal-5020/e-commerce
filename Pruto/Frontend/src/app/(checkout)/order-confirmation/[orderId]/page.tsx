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
    const { currentUser } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    let toastShown = false;

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || typeof orderId !== 'string') {
                setLoading(false);
                return;
            }
            if (!currentUser) { // Ensure user is logged in to fetch their order
                router.push('/login');
                return;
            }
            try {
                const data: Order = await fetchWithAuth(`${BASE_API_URL}/orders/${orderId}`);
                setOrder(data);
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
    }, [orderId, currentUser, router]);

    if (loading) return <div className="text-center p-8 min-h-screen">Loading order details...</div>;
    if (!order) return <div className="text-center p-8 text-red-500">Order not found.</div>;

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 className="text-4xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
                <p className="text-lg text-gray-700 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>

                <div className="border border-gray-200 rounded-md p-6 mb-6 text-left">
                    <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
                    <p className="text-gray-700 mb-2"><strong>Order ID:</strong> {order._id}</p>
                    <p className="text-gray-700 mb-2"><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                    <p className="text-gray-700 mb-2"><strong>Payment Status:</strong> <span className="capitalize">{order.paymentStatus}</span></p>
                    <p className="text-gray-700 mb-2"><strong>Order Status:</strong> <span className="capitalize">{order.orderStatus}</span></p>

                    <h3 className="text-xl font-semibold mt-4 mb-2">Shipping Address:</h3>
                    <p className="text-gray-700">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                    </p>

                    <h3 className="text-xl font-semibold mt-4 mb-2">Items:</h3>
                    <ul className="divide-y divide-gray-200">
                        {order.items.map(item => (
                            <li key={item._id} className="py-2 flex justify-between items-center">
                                <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={() => router.push('/user-profile?tab=orders')} // Navigate to user profile's order tab via query param
                    className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-md"
                >
                    View My Orders
                </button>
                <button
                    onClick={() => router.push('/')}
                    className="ml-4 bg-gray-300 text-gray-800 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-400 transition duration-300"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
