// app/admin/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { fetchWithAuth, BASE_API_URL } from '../../lib/api';
import ProductModal from '../../components/ProductModal'; // Import ProductModal
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

const AdminPage: React.FC = () => {
    const { isAdmin, loading: authLoading } = useAuth(); // Get auth loading state
    const [activeTab, setActiveTab] = useState<string>('dashboard'); // 'dashboard', 'products', 'users'
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showProductModal, setShowProductModal] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const router = useRouter();
    let toastShown = false;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data: Product[] = await fetchWithAuth(`${BASE_API_URL}/products`);
            setProducts(data);
        } catch (error: any) {
            console.error('Error fetching products for admin:', error);
            if (!toastShown) {
                toast.error(`Failed to load products: ${error.message}`);
                toastShown = true;
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Only proceed if auth is not loading and isAdmin status is determined
        if (!authLoading) {
            if (isAdmin) {
                // Fetch products only if the products tab is active initially or becomes active
                if (activeTab === 'products') {
                    fetchProducts();
                }
            } else {
                // If not admin, redirect to home or login
                if (!toastShown) {
                    toast.error('Access Denied: You must be an administrator to view this page.');
                    toastShown = true;
                }
                router.push('/');
            }
        }
    }, [isAdmin, authLoading, activeTab, fetchProducts, router]);

    const handleProductFormSubmit = async (productData: Product) => {
        try {
            if (editingProduct) {
                await fetchWithAuth(`${BASE_API_URL}/products/${editingProduct._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(productData),
                });
                toast.success('Product updated successfully!');
            } else {
                await fetchWithAuth(`${BASE_API_URL}/products`, {
                    method: 'POST',
                    body: JSON.stringify(productData),
                });
                toast.success('Product added successfully!');
            }
            setShowProductModal(false);
            setEditingProduct(null);
            fetchProducts(); // Re-fetch to update UI
        } catch (error: any) {
            console.error('Error saving product:', error);
            toast.error(`Failed to save product: ${error.message}`);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetchWithAuth(`${BASE_API_URL}/products/${productId}`, {
                    method: 'DELETE',
                });
                toast.success('Product deleted successfully!');
                fetchProducts();
            } catch (error: any) {
                console.error('Error deleting product:', error);
                toast.error(`Failed to delete product: ${error.message}`);
            }
        }
    };

    // Show loading while authentication status is being determined
    if (authLoading) return <div className="text-center p-8 min-h-screen">Checking admin status...</div>;
    // If not admin and authLoading is false, the useEffect will redirect.
    // This return prevents rendering the rest of the page before redirect.
    if (!isAdmin) return null;

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Tabs for Dashboard, Products, Users */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`py-3 px-6 text-lg font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => { setActiveTab('products'); fetchProducts(); }} // Fetch products when this tab is selected
                        className={`py-3 px-6 text-lg font-semibold ${activeTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-3 px-6 text-lg font-semibold ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        Users
                    </button>
                </div>

                {/* Dashboard Content */}
                {activeTab === 'dashboard' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-blue-800 mb-2">Total Products</h3>
                                <p className="text-3xl font-bold text-blue-600">{products.length}</p>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-green-800 mb-2">Total Orders</h3>
                                <p className="text-3xl font-bold text-green-600">--</p> {/* Placeholder */}
                            </div>
                            <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-yellow-800 mb-2">Total Users</h3>
                                <p className="text-3xl font-bold text-yellow-600">--</p> {/* Placeholder */}
                            </div>
                        </div>
                        {/* Add more dashboard widgets here */}
                    </div>
                )}

                {/* Product Management Content */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Product Management</h2>
                            <button
                                onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                            >
                                Add New Product
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center p-8">Loading products...</div>
                        ) : products.length === 0 ? (
                            <p className="text-gray-600">No products found. Add your first product!</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 border-b border-gray-200">Product</th>
                                            <th className="py-3 px-6 border-b border-gray-200">Category</th>
                                            <th className="py-3 px-6 border-b border-gray-200">Price</th>
                                            <th className="py-3 px-6 border-b border-gray-200">Stock</th>
                                            <th className="py-3 px-6 border-b border-gray-200">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700 text-sm font-light">
                                        {products.map(product => (
                                            <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={product.images && product.images.length > 0 ? product.images[0].url : `https://placehold.co/50x50/F0F4F8/333333?text=No+Image`}
                                                            alt={product.name}
                                                            className="w-10 h-10 rounded-full object-cover mr-3"
                                                        />
                                                        <span className="font-medium">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6 text-left">{product.category}</td>
                                                <td className="py-3 px-6 text-left">${product.price.toFixed(2)}</td>
                                                <td className="py-3 px-6 text-left">{product.stockQuantity}</td>
                                                <td className="py-3 px-6 text-left">
                                                    <div className="flex item-center justify-start space-x-2">
                                                        <button
                                                            onClick={() => { setEditingProduct(product); setShowProductModal(true); }}
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product._id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* User Management Content (Placeholder) */}
                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">User Management</h2>
                        <p className="text-gray-600">User management features will be implemented here.</p>
                        {/* You would typically fetch and display a list of users,
                            with options to edit roles, block users, etc. */}
                        <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
                            <p className="font-semibold text-blue-800">
                                To implement user management, you'll need backend endpoints for:
                            </p>
                            <ul className="list-disc list-inside text-blue-700 text-sm mt-2">
                                <li>Fetching all users (admin-only)</li>
                                <li>Updating user roles (e.g., setting admin status)</li>
                                <li>Deleting users</li>
                                <li>Potentially searching/filtering users</li>
                            </ul>
                            <p className="text-blue-700 text-sm mt-2">
                                Firebase Admin SDK can be used on your backend to manage user accounts and custom claims.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {showProductModal && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
                    onSubmit={handleProductFormSubmit}
                />
            )}
        </div>
    );
};

export default AdminPage;
