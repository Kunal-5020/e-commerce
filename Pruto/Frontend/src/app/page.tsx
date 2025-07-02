// app/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth, BASE_API_URL } from '../lib/api';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard'; // Assuming you'll create this

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

const HomePage: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const products: Product[] = await fetchWithAuth(`${BASE_API_URL}/products`);
                setFeaturedProducts(products.slice(0, 4)); // Take first 4 as featured
            } catch (error) {
                console.error('Error fetching featured products:', error);
            }
        };
        fetchFeaturedProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-4 text-center">
                <div className="container mx-auto">
                    <h1 className="text-5xl font-extrabold mb-4 animate-fadeIn">Discover Your Style at Pruto</h1>
                    <p className="text-xl mb-8 animate-slideUp">Shop the latest trends in fashion, electronics, and home goods.</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 shadow-lg animate-bounceIn"
                    >
                        Shop Now
                    </button>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="container mx-auto py-12 px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
                <div className="text-center mt-10">
                    <button
                        onClick={() => router.push('/products')}
                        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
                    >
                        View All Products
                    </button>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto py-12 px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CategoryCard category="Men's Clothing" imageUrl="https://placehold.co/400x250/F0F4F8/333333?text=Men's+Clothing" />
                    <CategoryCard category="Women's Clothing" imageUrl="https://placehold.co/400x250/F0F4F8/333333?text=Women's+Clothing" />
                    <CategoryCard category="Accessories" imageUrl="https://placehold.co/400x250/F0F4F8/333333?text=Accessories" />
                    <CategoryCard category="Electronics" imageUrl="https://placehold.co/400x250/F0F4F8/333333?text=Electronics" />
                    <CategoryCard category="Home Goods" imageUrl="https://placehold.co/400x250/F0F4F8/333333?text=Home+Goods" />
                    <CategoryCard category="Books" imageUrl="https://placehold.co/400x250/F0F4F8/333333?text=Books" />
                </div>
            </section>
        </div>
    );
};

export default HomePage;
