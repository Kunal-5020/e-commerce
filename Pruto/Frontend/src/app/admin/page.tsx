'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { fetchWithAuth, BASE_API_URL } from '../../lib/api';
import ProductModal from '../../components/ui/ProductModal';
import UserManagement from '../../components/admin/UserManagement';
import toast from 'react-hot-toast';
import { 
    LayoutDashboard, 
    Package, 
    Users, 
    Plus, 
    Edit3, 
    Trash2, 
    TrendingUp, 
    ShoppingCart, 
    UserCheck,
    Search,
    Filter,
    Eye,
    Star,
    DollarSign
} from 'lucide-react';

interface Product {
    _id?: string; // Made _id optional to handle new products
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
    dimensions?: { length: number; width: number; height: number };
    weight?: number;
}

const AdminPage: React.FC = () => {
    const { isAdmin, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
    const [showProductModal, setShowProductModal] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter();

    const fetchProducts = useCallback(async () => {
        setLoadingProducts(true);
        try {
            const data: Product[] = await fetchWithAuth(`${BASE_API_URL}/products`);
            setProducts(data);
        } catch (error: any) {
            console.error('Error fetching products for admin:', error);
            toast.error(`Failed to load products: ${error.message}`);
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading) {
            if (isAdmin) {
                if (activeTab === 'products') {
                    fetchProducts();
                }
            } else {
                toast.error('Access Denied: You must be an administrator to view this page.');
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
            fetchProducts();
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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mb-4 mx-auto"></div>
                    <p className="text-white text-xl font-medium">Checking admin status...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
        <div className={`relative overflow-hidden rounded-2xl p-6 ${color} transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                    {change && (
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium">
                            {change}
                        </span>
                    )}
                </div>
                <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
                <p className="text-white text-3xl font-bold">{value}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
                <Icon className="h-20 w-20" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-white/60 text-sm mt-1">Manage your e-commerce platform</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">A</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Navigation Tabs */}
                <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-2 mb-8 border border-white/10">
                    <div className="flex space-x-2">
                        {[
                            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                            { key: 'products', label: 'Products', icon: Package },
                            { key: 'users', label: 'Users', icon: Users }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setActiveTab(key);
                                    if (key === 'products') fetchProducts();
                                }}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                                    activeTab === key
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dashboard Content */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Products"
                                value={products.length}
                                icon={Package}
                                color="bg-gradient-to-br from-blue-500 to-blue-600"
                                change="+12%"
                            />
                            <StatCard
                                title="Total Orders"
                                value="1,247"
                                icon={ShoppingCart}
                                color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                                change="+8.2%"
                            />
                            <StatCard
                                title="Total Users"
                                value="3,891"
                                icon={UserCheck}
                                color="bg-gradient-to-br from-purple-500 to-purple-600"
                                change="+15.3%"
                            />
                            <StatCard
                                title="Revenue"
                                value="$24,780"
                                icon={DollarSign}
                                color="bg-gradient-to-br from-orange-500 to-orange-600"
                                change="+23.1%"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setShowProductModal(true);
                                    }}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
                                >
                                    <Plus className="h-6 w-6 mb-2" />
                                    <span className="font-medium">Add Product</span>
                                </button>
                                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                                    <TrendingUp className="h-6 w-6 mb-2" />
                                    <span className="font-medium">View Analytics</span>
                                </button>
                                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                                    <Users className="h-6 w-6 mb-2" />
                                    <span className="font-medium">Manage Users</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Management Content */}
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        {/* Products Header */}
                        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Product Management</h2>
                                    <p className="text-white/60 text-sm mt-1">Manage your product catalog</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button className="bg-white/10 border border-white/20 rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/20 transition-colors duration-200">
                                        <Filter className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingProduct(null);
                                            setShowProductModal(true);
                                        }}
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add Product</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products Content */}
                        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                            {loadingProducts ? (
                                <div className="text-center p-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent mb-4 mx-auto"></div>
                                    <p className="text-white/70">Loading products...</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="text-center p-12">
                                    <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />
                                    <p className="text-white/70 text-lg">No products found</p>
                                    <p className="text-white/50 text-sm mt-2">
                                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first product to get started!'}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-4 px-6 text-white/70 font-medium text-sm">PRODUCT</th>
                                                <th className="text-left py-4 px-6 text-white/70 font-medium text-sm">CATEGORY</th>
                                                <th className="text-left py-4 px-6 text-white/70 font-medium text-sm">PRICE</th>
                                                <th className="text-left py-4 px-6 text-white/70 font-medium text-sm">STOCK</th>
                                                <th className="text-left py-4 px-6 text-white/70 font-medium text-sm">RATING</th>
                                                <th className="text-left py-4 px-6 text-white/70 font-medium text-sm">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map((product, index) => (
                                                <tr 
                                                    key={product._id} 
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                                                    style={{ animationDelay: `${index * 0.1}s` }}
                                                >
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="relative">
                                                                <img
                                                                    src={product.images?.[0]?.url || `https://placehold.co/50x50/333/fff?text=${product.name.charAt(0)}`}
                                                                    alt={product.name}
                                                                    className="w-12 h-12 rounded-xl object-cover"
                                                                />
                                                                {product.isFeatured && (
                                                                    <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                                                                        <Star className="h-3 w-3 text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-medium">{product.name}</p>
                                                                <p className="text-white/50 text-sm">{product.sku || 'No SKU'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-white font-medium">
                                                        ${product.price.toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            product.stockQuantity > 10
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : product.stockQuantity > 0
                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                            {product.stockQuantity} units
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center space-x-1">
                                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                            <span className="text-white text-sm">
                                                                {product.averageRating?.toFixed(1) || 'N/A'}
                                                            </span>
                                                            <span className="text-white/50 text-xs">
                                                                ({product.numberOfReviews || 0})
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center space-x-2">
                                                            <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200 group">
                                                                <Eye className="h-4 w-4 text-white/70 group-hover:text-white" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingProduct(product);
                                                                    setShowProductModal(true);
                                                                }}
                                                                className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors duration-200 group"
                                                            >
                                                                <Edit3 className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                                                            </button>
                                                            <button
                                                                onClick={() => product._id && handleDeleteProduct(product._id)}
                                                                className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors duration-200 group"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-400 group-hover:text-red-300" />
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
                    </div>
                )}

                {/* User Management Content */}
                {activeTab === 'users' && (
                    <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <UserManagement />
                    </div>
                )}
            </div>

            {showProductModal && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => {
                        setShowProductModal(false);
                        setEditingProduct(null);
                    }}
                    onSubmit={handleProductFormSubmit}
                />
            )}
        </div>
    );
};

export default AdminPage;