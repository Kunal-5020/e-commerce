// app/wishlist/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/authContext';
import { useCart } from '../../../lib/cartContext';
import { fetchWithAuth, BASE_API_URL } from '../../../lib/api';
import toast from 'react-hot-toast'; // Import toast

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: { url: string; altText: string }[];
    category: string;
    brand?: string;
    sizes?: string[];
    colors?: { name: string; hexCode: string }[];
    stockQuantity: number;
    sku?: string;
    averageRating?: number;
    numberOfReviews?: number;
    isFeatured?: boolean;
    isActive?: boolean;
}

const WishlistPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { addToCart } = useCart();
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    let toastShown = false;

    const fetchWishlist = useCallback(async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setLoading(true);
        try {
            const data: { wishlist: Product[] } = await fetchWithAuth(`${BASE_API_URL}/user/wishlist`);
            setWishlistItems(data.wishlist || []);
        } catch (error: any) {
            console.error('Error fetching wishlist:', error);
            if (!toastShown) {
                toast.error(`Failed to load wishlist: ${error.message}`);
                toastShown = true;
            }
        } finally {
            setLoading(false);
        }
    }, [currentUser, router]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const handleRemoveFromWishlist = async (productId: string) => {
        if (!currentUser) return;
        try {
            await fetchWithAuth(`${BASE_API_URL}/user/wishlist/${productId}`, {
                method: 'DELETE',
            });
            toast.success('Product removed from wishlist.');
            fetchWishlist(); // Re-fetch to update UI
        } catch (error: any) {
            console.error('Error removing from wishlist:', error);
            toast.error(`Failed to remove from wishlist: ${error.message}`);
        }
    };

    const handleMoveToCart = async (product: Product) => {
        await addToCart(product._id, 1, product.sizes?.[0] || null, product.colors?.[0] || null);
        handleRemoveFromWishlist(product._id); // Remove from wishlist after adding to cart
    };

    if (loading) return <div className="text-center p-8 min-h-screen">Loading wishlist...</div>;
    if (!currentUser) return <div className="text-center p-8 text-red-500">Please log in to view your wishlist.</div>;

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Wishlist</h1>

            {wishlistItems.length === 0 ? (
                <div className="text-center text-gray-600 text-lg">
                    Your wishlist is empty. <button onClick={() => router.push('/products')} className="text-blue-600 hover:underline">Discover products!</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {wishlistItems.map(product => (
                        <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0].url : `https://placehold.co/300x200/F0F4F8/333333?text=No+Image`}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleMoveToCart(product)}
                                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300 text-sm"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromWishlist(product._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
