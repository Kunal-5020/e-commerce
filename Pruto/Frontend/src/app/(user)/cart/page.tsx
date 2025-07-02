// app/cart/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../lib/cartContext';
import CartItem from '../../../components/ui/CartItem'; // Import the CartItem component

const CartPage: React.FC = () => {
    const { cartItems, updateCartItemQuantity, removeFromCart, cartTotal, cartLoading } = useCart();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        // Simulate checkout process
        setTimeout(() => {
            router.push('/checkout');
        }, 1000);
    };

    const handleContinueShopping = () => {
        router.push('/products');
    };

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const savings = cartItems.reduce((total, item) => {
        // Assume 10% discount for demonstration
        return total + (item.product.price * item.quantity * 0.1);
    }, 0);

    if (cartLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="text-gray-600 text-lg">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Shopping Cart
                            </h1>
                            {cartItems.length > 0 && (
                                <p className="text-gray-600 mt-2">
                                    {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleContinueShopping}
                            className="hidden md:flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {cartItems.length === 0 ? (
                    /* Empty Cart State */
                    <div className="max-w-md mx-auto text-center">
                        <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                            <button
                                onClick={handleContinueShopping}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Cart with Items */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                                    <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {cartItems.map((item, index) => (
                                        <div 
                                            key={item.product._id + (item.selectedSize || '') + (item.selectedColor ? item.selectedColor.hexCode : '')}
                                            className="transform hover:bg-gray-50 transition-colors duration-200"
                                            style={{ 
                                                animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                                            }}
                                        >
                                            <CartItem
                                                item={item}
                                                updateQuantity={updateCartItemQuantity}
                                                removeItem={removeFromCart}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({itemCount} items)</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    
                                    {savings > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Savings</span>
                                            <span>-${savings.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>${(cartTotal * 0.08).toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-xl font-bold text-gray-800">
                                            <span>Total</span>
                                            <span>${(cartTotal + cartTotal * 0.08 - savings).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                                        isCheckingOut
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                                    }`}
                                >
                                    {isCheckingOut ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Proceed to Checkout
                                        </div>
                                    )}
                                </button>

                                <button
                                    onClick={handleContinueShopping}
                                    className="w-full mt-3 py-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                                >
                                    Continue Shopping
                                </button>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t">
                                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            Secure
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Fast Shipping
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default CartPage;