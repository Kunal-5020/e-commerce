// app/products/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { fetchWithAuth, BASE_API_URL } from '../../../lib/api'; 
import { fetchPublic, BASE_API_URL } from '@/lib/publicApi';
import ProductCard from '../../../components/ui/ProductCard'; // Correct path to ProductCard
import toast from 'react-hot-toast';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, Eye, Zap, Award, TrendingUp, Package } from 'lucide-react';

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

const ProductListingPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const searchParams = useSearchParams();
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // Using tuple for price range

    // Fetch products on component mount
    useEffect(() => {
        const fetchProductsData = async () => {
            setLoading(true);
            try {
                const data: Product[] = await fetchPublic(`${BASE_API_URL}/products`);
                setProducts(data);
                setFilteredProducts(data); // Initialize filtered products with all products
            } catch (error: any) {
                console.error('Error fetching products:', error);
                toast.error(`Failed to load products: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchProductsData();
    }, []);

    // Initialize selectedCategory from URL param
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    // Derive unique categories from fetched products
    const categories = ['All', ...new Set(products.map(p => p.category))];

    // Stats for the page (derived from current `products` state)
    const stats = [
        { number: products.length.toString(), label: 'Total Products', icon: Package },
        { number: categories.length - 1, label: 'Categories', icon: Grid }, // Subtract 'All'
        { number: products.length > 0 ? (products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length).toFixed(1) : 'N/A', label: 'Avg Rating', icon: Star },
        { number: products.length > 0 ? `${((products.filter(p => p.stockQuantity > 0).length / products.length) * 100).toFixed(0)}%` : 'N/A', label: 'In Stock', icon: TrendingUp }
    ];

    // Apply filters and sorting whenever dependencies change
    useEffect(() => {
        let currentProducts = [...products];

        // Apply category filter
        if (selectedCategory !== 'All') {
            currentProducts = currentProducts.filter(p => p.category === selectedCategory);
        }

        // Apply search term filter
        if (searchTerm) {
            currentProducts = currentProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply price range filter
        currentProducts = currentProducts.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Apply sorting
        currentProducts.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return (b.averageRating || 0) - (a.averageRating || 0);
                case 'popular': // Assuming 'popular' means more reviews
                    return (b.numberOfReviews || 0) - (a.numberOfReviews || 0);
                default: // Sort by name
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredProducts(currentProducts);
    }, [products, searchTerm, selectedCategory, sortBy, priceRange]);


    if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-xl text-gray-600">Loading amazing products...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
                <div className="absolute top-20 left-20 w-60 h-60 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{animationDelay: '6s'}}></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 cursor-default">
                        Our Products
                    </h1>
                    <div className="relative inline-block mb-6">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text transition-all duration-500 cursor-default">
                            Premium Collection
                        </h2>
                        <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:w-full transition-all duration-700"></div>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Discover our carefully curated collection of premium products, each selected for quality, innovation, and exceptional value.
                    </p>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="backdrop-blur-md bg-white/20 rounded-3xl p-6 text-center hover:scale-105 hover:rotate-1 hover:bg-white/30 transition-all duration-500 shadow-lg hover:shadow-2xl group cursor-default"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                                {stat.number}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="backdrop-blur-md bg-white/20 rounded-3xl p-8 mb-12 shadow-lg">
                    <div className="grid md:grid-cols-4 gap-6">
                        {/* Search Bar */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products, brands, or categories..."
                                    className="w-full pl-10 pr-4 py-3 backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/40 transition-all duration-300 hover:bg-white/35"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full p-3 backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/40 transition-all duration-300 hover:bg-white/35"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Options */}
                        <div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-3 backdrop-blur-sm bg-white/30 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/40 transition-all duration-300 hover:bg-white/35"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>

                    {/* Additional Filters Row */}
                    <div className="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-white/20">
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 font-medium">View:</span>
                            <div className="flex bg-white/20 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-600">
                            <Filter className="w-4 h-4" />
                            <span className="text-sm">
                                Showing {filteredProducts.length} of {products.length} products
                            </span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="backdrop-blur-md bg-white/20 rounded-3xl p-12 max-w-md mx-auto">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                    </div>
                ) : (
                    <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Load More Button - Placeholder for pagination */}
                {filteredProducts.length > 0 && (
                    <div className="text-center mt-16">
                        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto">
                            <Zap className="w-5 h-5" />
                            <span>Load More Products</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListingPage;
