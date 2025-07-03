// lib/wishlistContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './authContext'; // Assuming useAuth provides currentUser
import { fetchWithAuth, BASE_API_URL } from './api';
import toast from 'react-hot-toast';

// Define the structure of a wishlist item (which is a Product in this case)
interface WishlistItem {
    description: string;
    category: string;
    stockQuantity: any;
    _id: string;
    name: string;
    price: number;
    images: { url: string; altText: string }[];
    // Include other product fields as needed for display in wishlist
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    loading: boolean;
    fetchWishlist: () => Promise<void>;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

interface WishlistProviderProps {
    children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
    const { currentUser, loading: authLoading } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchWishlist = useCallback(async () => {
        if (!currentUser) {
            setWishlistItems([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // Backend endpoint to fetch user's wishlist
            const data: { wishlist: WishlistItem[] } = await fetchWithAuth(`${BASE_API_URL}/user/wishlist`);
            setWishlistItems(data.wishlist || []);
        } catch (error: any) {
            console.error('Error fetching wishlist:', error);
            toast.error(`Failed to load wishlist: ${error.message}`);
            setWishlistItems([]); // Clear wishlist on error
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!authLoading) { // Only fetch wishlist once auth status is determined
            fetchWishlist();
        }
    }, [authLoading, fetchWishlist]);

    const addToWishlist = async (productId: string) => {
        if (!currentUser) {
            toast.error('Please log in to add items to your wishlist.');
            return;
        }
        try {
            // Backend endpoint to add item to wishlist
            await fetchWithAuth(`${BASE_API_URL}/user/wishlist/${productId}`, {
                method: 'POST',
            });
            await fetchWishlist(); // Re-fetch wishlist to update state
        } catch (error: any) {
            console.error('Error adding to wishlist:', error);
            toast.error(`Failed to add to wishlist: ${error.message}`);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!currentUser) {
            toast.error('Please log in to manage your wishlist.');
            return;
        }
        try {
            // Backend endpoint to remove item from wishlist
            await fetchWithAuth(`${BASE_API_URL}/user/wishlist/${productId}`, {
                method: 'DELETE',
            });
            await fetchWishlist(); // Re-fetch wishlist to update state
        } catch (error: any) {
            console.error('Error removing from wishlist:', error);
            toast.error(`Failed to remove from wishlist: ${error.message}`);
        }
    };

    const value = {
        wishlistItems,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
