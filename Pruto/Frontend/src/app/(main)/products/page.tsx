// app/products/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Use useRouter and useSearchParams
import { fetchWithAuth, BASE_API_URL } from '../../../lib/api';
import ProductCard from '../../../components/ProductCard';
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

const ProductListingPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const searchParams = useSearchParams(); // Get search params from URL
    const categoryParam = searchParams.get('category'); // Get category from query string
    let toastShown = false;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data: Product[] = await fetchWithAuth(`${BASE_API_URL}/products`);
                setProducts(data);
                setFilteredProducts(data); // Initialize filtered products
            } catch (error: any) {
                console.error('Error fetching products:', error);
                if (!toastShown) {
                    toast.error(`Failed to load products: ${error.message}`);
                    toastShown = true;
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let currentProducts = [...products];

        // Apply category filter from URL params if present
        if (categoryParam) {
            currentProducts = currentProducts.filter(p => p.category === categoryParam);
        }

        // Apply search term filter
        if (searchTerm) {
            currentProducts = currentProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProducts(currentProducts);
    }, [products, searchTerm, categoryParam]);


    if (loading) return <div className="text-center p-8">Loading products...</div>;

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Products</h1>

            {/* Search Bar */}
            <div className="mb-8 flex justify-center">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full max-w-md p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-center text-gray-600 text-lg">No products found matching your criteria.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductListingPage;
