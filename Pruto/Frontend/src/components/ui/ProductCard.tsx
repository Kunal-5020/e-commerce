// components/ProductCard.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect } from 'react'; // Correctly imported useState and useEffect
import { useRouter } from 'next/navigation';
import { useCart } from '../../lib/cartContext'; // Corrected path
import { useWishlist } from '../../lib/wishlistContext'; // Corrected path
import toast from 'react-hot-toast';
import { ShoppingBag, Star, Heart, Sparkles, Award, Eye, ShoppingCart } from 'lucide-react';

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

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    // Destructure wishlist functions from useWishlist hook
    const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // Set initial liked state based on whether the product is in the wishlist
    useEffect(() => {
        setIsLiked(wishlistItems.some(item => item._id === product._id));
    }, [wishlistItems, product._id]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigating to product detail page when clicking add to cart
        addToCart(product._id, 1, product.sizes?.[0] || null, product.colors?.[0] || null); // Add default size/color if available
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigating to product detail page when clicking wishlist icon
        if (isLiked) {
            await removeFromWishlist(product._id);
            // toast.success('Removed from wishlist!');
        } else {
            await addToWishlist(product._id);
            // toast.success('Added to wishlist!');
        }
        // The useEffect above will automatically update isLiked based on the new wishlistItems state
    };

    const handleProductClick = () => {
        router.push(`/products/${product._id}`);
    };

    return (
        <div
            className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleProductClick} // Navigate on card click
        >
            <div className="relative mb-4 overflow-hidden rounded-2xl">
                <img
                    src={product.images && product.images.length > 0 ? product.images[0].url : `https://placehold.co/400x250/F0F4F8/333333?text=No+Image`}
                    alt={product.images && product.images.length > 0 ? product.images[0].altText : product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button
                    onClick={handleToggleWishlist} // Calls the wishlist toggle function
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                    <Heart className={`w-4 h-4 transition-colors duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                {/* Removed the extra Eye button as it duplicates card click functionality */}
                {product.isFeatured && (
                    <div className="absolute top-3 left-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>Featured</span>
                        </div>
                    </div>
                )}
                {product.stockQuantity < 10 && product.stockQuantity > 0 && ( // Only show if stock is low but not zero
                    <div className="absolute bottom-3 left-3">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Only {product.stockQuantity} left!
                        </div>
                    </div>
                )}
                {product.stockQuantity === 0 && ( // Indicate out of stock
                    <div className="absolute bottom-3 left-3">
                        <div className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Out of Stock
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 pt-4 space-y-3"> {/* Adjusted padding-top for better spacing */}
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300">
                        {product.name}
                    </h3>
                    {product.brand && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {product.brand}
                        </span>
                    )}
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                            {product.averageRating?.toFixed(1) || 'N/A'}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">
                        ({product.numberOfReviews || 0} reviews)
                    </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)} {/* Ensure price is always two decimal places */}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stockQuantity === 0} // Disable button if out of stock
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2
                            ${product.stockQuantity === 0
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105'
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Add'}</span>
                    </button>
                </div>

                {product.colors && product.colors.length > 0 && ( // Changed from > 1 to > 0 to show if there's at least one color
                    <div className="flex items-center space-x-2 pt-2">
                        <span className="text-xs text-gray-500">Colors:</span>
                        <div className="flex space-x-1">
                            {product.colors.slice(0, 3).map((color, index) => (
                                <div
                                    key={index}
                                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                    style={{ backgroundColor: color.hexCode }}
                                    title={color.name}
                                />
                            ))}
                            {product.colors.length > 3 && (
                                <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
