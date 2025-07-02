// components/ProductCard.tsx
'use client'; // This component uses client-side hooks

import React from 'react';
import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation
import { useCart } from '../lib/cartContext';
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

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigating to product detail page
        addToCart(product._id, 1, product.sizes?.[0] || null, product.colors?.[0] || null); // Add default size/color if available
    };

    return (
        <div
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition duration-300 flex flex-col"
            onClick={() => router.push(`/products/${product._id}`)}
        >
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
                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 text-sm"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
