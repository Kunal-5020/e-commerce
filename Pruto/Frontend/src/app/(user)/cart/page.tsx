// app/cart/page.tsx
'use client'; // This component uses client-side hooks

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../lib/cartContext';
import CartItem from '../../../components/CartItem'; // Import the CartItem component

const CartPage: React.FC = () => {
    const { cartItems, updateCartItemQuantity, removeFromCart, cartTotal, cartLoading } = useCart();
    const router = useRouter();

    if (cartLoading) return <div className="text-center p-8 min-h-screen">Loading cart...</div>;

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center text-gray-600 text-lg">
                    Your cart is empty. <button onClick={() => router.push('/products')} className="text-blue-600 hover:underline">Start shopping!</button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="divide-y divide-gray-200">
                        {cartItems.map(item => (
                            <CartItem
                                key={item.product._id + (item.selectedSize || '') + (item.selectedColor ? item.selectedColor.hexCode : '')}
                                item={item}
                                updateQuantity={updateCartItemQuantity}
                                removeItem={removeFromCart}
                            />
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end items-center">
                        <span className="text-2xl font-bold text-gray-800 mr-4">Total: ${cartTotal.toFixed(2)}</span>
                        <button
                            onClick={() => router.push('/checkout')}
                            className="bg-green-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
