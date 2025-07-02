'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/authContext';
import { useCart } from '../../../lib/cartContext';
import { fetchWithAuth, BASE_API_URL } from '../../../lib/api';
import toast from 'react-hot-toast';
import { Heart, ShoppingCart, Trash2, Star, Package, ArrowRight } from 'lucide-react';

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
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
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
        setRemovingId(productId);
        try {
            await fetchWithAuth(`${BASE_API_URL}/user/wishlist/${productId}`, {
                method: 'DELETE',
            });
            toast.success('Removed from wishlist');
            fetchWishlist();
        } catch (error: any) {
            console.error('Error removing from wishlist:', error);
            toast.error(`Failed to remove: ${error.message}`);
        } finally {
            setRemovingId(null);
        }
    };

    const handleMoveToCart = async (product: Product) => {
        setAddingToCartId(product._id);
        try {
            await addToCart(product._id, 1, product.sizes?.[0] || null, product.colors?.[0] || null);
            handleRemoveFromWishlist(product._id);
            toast.success('Added to cart!');
        } catch (error) {
            toast.error('Failed to add to cart');
        } finally {
            setAddingToCartId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
                        <p className="text-lg text-slate-600">Loading your wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
                    <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Required</h2>
                    <p className="text-slate-600 mb-6">Please log in to view your wishlist</p>
                    <button 
                        onClick={() => router.push('/login')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Your Wishlist
                                </h1>
                                <p className="text-slate-600">{wishlistItems.length} items saved</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/products')}
                            className="hidden md:flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            <Package className="w-4 h-4" />
                            <span>Browse Products</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="p-6 bg-white rounded-2xl shadow-xl mb-6">
                                <Heart className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
                                <p className="text-slate-600 mb-6">Start adding products you love to keep track of them</p>
                                <button
                                    onClick={() => router.push('/products')}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center space-x-2 mx-auto"
                                >
                                    <span>Explore Products</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((product, index) => (
                            <div
                                key={product._id}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                {/* Product Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.images && product.images.length > 0 
                                            ? product.images[0].url 
                                            : `https://placehold.co/400x300/F1F5F9/64748B?text=${encodeURIComponent(product.name)}`
                                        }
                                        alt={product.name}
                                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {product.isFeatured && (
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            Featured
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleRemoveFromWishlist(product._id)}
                                        disabled={removingId === product._id}
                                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110 disabled:opacity-50"
                                    >
                                        {removingId === product._id ? (
                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                        )}
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        {product.brand && (
                                            <p className="text-sm text-purple-600 font-medium mb-1">{product.brand}</p>
                                        )}
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">{product.description}</p>
                                        
                                        {/* Rating */}
                                        {product.averageRating && (
                                            <div className="flex items-center space-x-1 mb-3">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(product.averageRating!) 
                                                                ? 'text-yellow-400 fill-yellow-400' 
                                                                : 'text-slate-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    ({product.numberOfReviews || 0})
                                                </span>
                                            </div>
                                        )}

                                        {/* Stock Status */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                product.stockQuantity > 0 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleMoveToCart(product)}
                                            disabled={addingToCartId === product._id || product.stockQuantity === 0}
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {addingToCartId === product._id ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-4 h-4" />
                                                    <span>Add to Cart</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromWishlist(product._id)}
                                            disabled={removingId === product._id}
                                            className="p-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                        >
                                            {removingId === product._id ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default WishlistPage;