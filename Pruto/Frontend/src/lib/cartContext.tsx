// lib/cartContext.tsx
'use client'; // This context uses client-side hooks

import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { useAuth } from './authContext';
import { fetchWithAuth, BASE_API_URL } from './api';
import toast from 'react-hot-toast'; 

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        images: { url: string; altText: string }[];
        // Add other product fields that might be populated
    };
    quantity: number;
    priceAtTimeOfAddition: number;
    selectedSize?: string;
    selectedColor?: { name: string; hexCode: string };
    _id: string; // Mongoose subdocument ID for cart item
}

interface CartContextType {
    cartItems: CartItem[];
    cartLoading: boolean;
    addToCart: (productId: string, quantity: number, selectedSize?: string | null, selectedColor?: { name: string; hexCode: string } | null) => Promise<void>;
    updateCartItemQuantity: (productId: string, quantity: number, selectedSize?: string | null, selectedColor?: { name: string; hexCode: string } | null) => Promise<void>;
    removeFromCart: (productId: string, selectedSize?: string | null, selectedColor?: { name: string; hexCode: string } | null) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
    cartTotal: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const { currentUser } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartLoading, setCartLoading] = useState<boolean>(true);
    let toastShown = false;

    const fetchCart = useCallback(async () => {
        if (!currentUser) {
            setCartItems([]);
            setCartLoading(false);
            return;
        }
        setCartLoading(true);
        try {
            const data = await fetchWithAuth(`${BASE_API_URL}/cart`);
            setCartItems(data.items || []);
        } catch (error: any) {
            console.error('Error fetching cart:', error);
            if (error.message.includes('Cart is empty or not found')) {
                setCartItems([]);
            } else {
                if (!toastShown) {
                toast.error(`Failed to load cart: ${error.message}`);
                toastShown = true;
                }
            }
        } finally {
            setCartLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId: string, quantity: number, selectedSize: string | null = null, selectedColor: { name: string; hexCode: string } | null = null) => {
        if (!currentUser) {
            toast.error('Please log in to add items to your cart.');
            return;
        }
        try {
            const data = await fetchWithAuth(`${BASE_API_URL}/cart/add`, {
                method: 'POST',
                body: JSON.stringify({ productId, quantity, selectedSize, selectedColor }),
            });
            setCartItems(data.cart.items);
            toast.success('Item added to cart!');
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            toast.error(`Failed to add item to cart: ${error.message}`);
        }
    };

    const updateCartItemQuantity = async (productId: string, quantity: number, selectedSize: string | null = null, selectedColor: { name: string; hexCode: string } | null = null) => {
        if (!currentUser) return;
        try {
            const data = await fetchWithAuth(`${BASE_API_URL}/cart/update/${productId}`, {
                method: 'PUT',
                body: JSON.stringify({ quantity, selectedSize, selectedColor }),
            });
            setCartItems(data.cart.items);
            toast.success('Cart updated successfully!');
        } catch (error: any) {
            console.error('Error updating cart item quantity:', error);
            toast.error(`Failed to update cart item: ${error.message}`);
        }
    };

    const removeFromCart = async (productId: string, selectedSize: string | null = null, selectedColor: { name: string; hexCode: string } | null = null) => {
        if (!currentUser) return;
        try {
            const data = await fetchWithAuth(`${BASE_API_URL}/cart/remove/${productId}`, {
                method: 'DELETE',
                body: JSON.stringify({ selectedSize, selectedColor }),
            });
            setCartItems(data.cart.items);
            toast.success('Item removed from cart.');
        } catch (error: any) {
            console.error('Error removing from cart:', error);
            toast.error(`Failed to remove item from cart: ${error.message}`);
        }
    };

    const clearCart = async () => {
        if (!currentUser) return;
        setCartItems([]); // Clear locally immediately
        // If your backend has a specific clear cart endpoint, call it here
        // e.g., await fetchWithAuth(`${BASE_API_URL}/cart/clear`, { method: 'DELETE' });
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    const value: CartContextType = {
        cartItems,
        cartLoading,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        cartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
