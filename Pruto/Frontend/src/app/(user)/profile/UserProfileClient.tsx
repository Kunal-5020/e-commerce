// app/user/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/authContext';
import { useWishlist } from '../../../lib/wishlistContext';
import { fetchWithAuth, BASE_API_URL } from '../../../lib/api';
import AddressModal from '../../../components/ui/AddressModal';
import ProductCard from '../../../components/ui/ProductCard';
import toast from 'react-hot-toast';
import {
    User,
    MapPin,
    Package,
    Edit3,
    Save,
    X,
    Plus,
    Trash2,
    Eye,
    Calendar,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    Mail,
    Phone,
    Shield,
    Heart,
    Menu
} from 'lucide-react';

import type { ShippingAddress } from '../../../components/ui/AddressModal';

// Define the Product type for wishlist items
type Product = {
    _id: string;
    name: string;
    price: number;
    images: { url: string; altText: string }[];
    description: string;
    category: string;
    stockQuantity: number;
    averageRating?: number;
    numberOfReviews?: number;
    isFeatured?: boolean;
    isActive?: boolean;
};

interface UserProfileData {
    _id: string;
    firebaseUid: string;
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    shippingAddresses: ShippingAddress[];
    orders: string[];
    wishlist: string[];
}

interface OrderItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        images: { url: string; altText: string }[];
    };
    name: string;
    quantity: number;
    price: number;
    selectedSize?: string;
    selectedColor?: { name: string; hexCode: string };
}

interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentStatus: string;
    orderStatus: string;
    trackingNumber?: string;
    paymentMethod?: string;
    createdAt: string;
    updatedAt: string;
}

const UserProfileClient: React.FC = () => {
    // Destructure currentUser and authLoading from useAuth
    const { currentUser, loading: authLoading } = useAuth();
    const { wishlistItems, removeFromWishlist, fetchWishlist } = useWishlist();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
    // This loading state is for the user profile data, not auth status
    const [loadingProfileData, setLoadingProfileData] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'profile');
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
    const [profileFormData, setProfileFormData] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    });
    const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
    const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [savingProfile, setSavingProfile] = useState<boolean>(false);

    const fetchUserProfile = useCallback(async () => {
        // Only attempt to fetch profile if auth is no longer loading and a user is present
        if (authLoading) {
            // Still waiting for authentication status to be determined
            return;
        }

        if (!currentUser) {
            // If auth is done loading and no current user, redirect to login
            router.push('/login');
            return;
        }

        setLoadingProfileData(true); // Set loading for profile data
        try {
            const data: UserProfileData = await fetchWithAuth(`${BASE_API_URL}/user/profile`);
            setUserProfile(data);
            setProfileFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phone: data.phone || ''
            });
        } catch (error: any) {
            console.error('Error fetching user profile:', error);
            toast.error(`Failed to load profile: ${error.message}`);
        } finally {
            setLoadingProfileData(false); // Done loading profile data
        }
    }, [currentUser, router, authLoading]); // Added authLoading to dependencies

    const fetchUserOrders = useCallback(async () => {
        if (authLoading || !currentUser) return; // Wait for auth, ensure user is logged in
        try {
            const data: Order[] = await fetchWithAuth(`${BASE_API_URL}/orders`);
            setUserOrders(data);
        } catch (error: any) {
            console.error('Error fetching user orders:', error);
            toast.error(`Failed to load orders: ${error.message}`);
        }
    }, [currentUser, authLoading]); // Added authLoading to dependencies

    useEffect(() => {
        // Trigger fetching data only when authentication state is resolved
        if (!authLoading) {
            fetchUserProfile();
            fetchUserOrders();
            fetchWishlist();
        }
    }, [authLoading, fetchUserProfile, fetchUserOrders, fetchWishlist]); // Depend on authLoading

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && typeof tabParam === 'string') {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await fetchWithAuth(`${BASE_API_URL}/user/profile`, {
                method: 'PUT',
                body: JSON.stringify(profileFormData),
            });
            toast.success('Profile updated successfully!');
            setIsEditingProfile(false);
            fetchUserProfile();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(`Failed to update profile: ${error.message}`);
        } finally {
            setSavingProfile(false);
        }
    };

    const handleAddressFormSubmit = async (addressData: ShippingAddress) => {
        try {
            if (editingAddress) {
                await fetchWithAuth(`${BASE_API_URL}/user/addresses/${editingAddress._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(addressData),
                });
                toast.success('Address updated successfully!');
            } else {
                await fetchWithAuth(`${BASE_API_URL}/user/addresses`, {
                    method: 'POST',
                    body: JSON.stringify(addressData),
                });
                toast.success('Address added successfully!');
            }
            setShowAddressModal(false);
            setEditingAddress(null);
            fetchUserProfile();
        } catch (error: any) {
            console.error('Error saving address:', error);
            toast.error(`Failed to save address: ${error.message}`);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await fetchWithAuth(`${BASE_API_URL}/user/addresses/${addressId}`, {
                    method: 'DELETE',
                });
                toast.success('Address deleted successfully!');
                fetchUserProfile();
            } catch (error: any) {
                console.error('Error deleting address:', error);
                toast.error(`Failed to delete address: ${error.message}`);
            }
        }
    };

    const handleRemoveFromWishlist = async (productId: string) => {
        if (window.confirm('Are you sure you want to remove this item from your wishlist?')) {
            await removeFromWishlist(productId);
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setShowMobileMenu(false);
    };

    const getOrderStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-blue-500" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            default:
                return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    const getOrderStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'wishlist', label: 'Wishlist', icon: Heart }
    ];

    // Show loading spinner if authentication is still in progress OR if profile data is loading
    if (authLoading || loadingProfileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
                        <p className="text-lg text-slate-600">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If auth is done loading and no currentUser, redirect to login
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
                <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Authentication Required</h2>
                    <p className="text-slate-600 mb-6">Please log in to access your account</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium w-full sm:w-auto"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    // If currentUser exists but userProfile is null (meaning fetchUserProfile failed or returned null)
    if (!userProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
                <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <User className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Profile Not Found</h2>
                    <p className="text-slate-600">Unable to load your profile information</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
                <div className="container mx-auto px-4 py-6 sm:py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl">
                                <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    My Account
                                </h1>
                                <p className="text-slate-600 text-sm sm:text-base">Welcome back, {userProfile.firstName}!</p>
                            </div>
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 sm:py-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
                    {/* Desktop Navigation Tabs */}
                    <div className="hidden md:flex border-b border-slate-200 bg-slate-50/50">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => handleTabChange(id)}
                                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 ${
                                    activeTab === id
                                        ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {showMobileMenu && (
                        <div className="md:hidden bg-slate-50 border-b border-slate-200">
                            <div className="py-2">
                                {tabs.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => handleTabChange(id)}
                                        className={`flex items-center space-x-3 w-full px-4 py-3 font-medium transition-all duration-200 ${
                                            activeTab === id
                                                ? 'text-purple-600 bg-purple-50'
                                                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mobile Tab Indicator */}
                    <div className="md:hidden bg-slate-50 border-b border-slate-200 px-4 py-3">
                        <div className="flex items-center space-x-2">
                            {tabs.find(tab => tab.id === activeTab) && (
                                <>
                                    {React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                                        className: "w-5 h-5 text-purple-600"
                                    })}
                                    <span className="font-medium text-slate-800">
                                        {tabs.find(tab => tab.id === activeTab)!.label}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <>
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Personal Information</h2>
                                        {!isEditingProfile && (
                                            <button
                                                onClick={() => setIsEditingProfile(true)}
                                                className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 w-full sm:w-auto"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                                <span>Edit Profile</span>
                                            </button>
                                        )}
                                    </div>

                                    {isEditingProfile ? (
                                        <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={profileFormData.firstName}
                                                    onChange={handleProfileFormChange}
                                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={profileFormData.lastName}
                                                    onChange={handleProfileFormChange}
                                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={profileFormData.phone}
                                                    onChange={handleProfileFormChange}
                                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={userProfile.email}
                                                    className="w-full p-3 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                                                    disabled
                                                />
                                                <p className="text-sm text-slate-500 mt-1">Email cannot be changed here</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={savingProfile}
                                                    className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 w-full sm:w-auto"
                                                >
                                                    {savingProfile ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Save className="w-4 h-4" />
                                                    )}
                                                    <span>Save Changes</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditingProfile(false)}
                                                    className="flex items-center justify-center space-x-2 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors duration-200 w-full sm:w-auto"
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span>Cancel</span>
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                                                    <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-slate-600">Full Name</p>
                                                        <p className="font-medium text-slate-800 truncate">
                                                            {userProfile.firstName} {userProfile.lastName || ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                                                    <Mail className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-slate-600">Email Address</p>
                                                        <p className="font-medium text-slate-800 truncate">{userProfile.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                                                    <Phone className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-slate-600">Phone Number</p>
                                                        <p className="font-medium text-slate-800 truncate">{userProfile.phone || 'Not provided'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                                                    <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-slate-600">Account Status</p>
                                                        <p className="font-medium text-green-600">Verified</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Shipping Addresses</h2>
                                    <button
                                        onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                                        className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 w-full sm:w-auto"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Address</span>
                                    </button>
                                </div>

                                {userProfile.shippingAddresses.length === 0 ? (
                                    <div className="text-center py-8 sm:py-12">
                                        <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-800 mb-2">No addresses found</h3>
                                        <p className="text-slate-600 mb-6 px-4">Add your first shipping address to get started</p>
                                        <button
                                            onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 w-full sm:w-auto"
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        {userProfile.shippingAddresses.map((address, index) => (
                                            <div
                                                key={address._id}
                                                className="p-4 sm:p-6 bg-slate-50 rounded-lg border-2 border-transparent hover:border-purple-200 transition-all duration-200"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                                                        <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                                        <h3 className="font-medium text-slate-800 truncate">
                                                            {address.addressName || `Address ${index + 1}`}
                                                        </h3>
                                                        {address.isDefault && (
                                                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex-shrink-0">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 mb-4 text-sm sm:text-base">
                                                    {address.street}<br />
                                                    {address.city}, {address.state} {address.zipCode}<br />
                                                    {address.country}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                                                    <button
                                                        onClick={() => { setEditingAddress(address); setShowAddressModal(true); }}
                                                        className="flex items-center justify-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium bg-purple-50 px-3 py-2 rounded-md hover:bg-purple-100 transition-colors w-full sm:w-auto"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => address._id && handleDeleteAddress(address._id)}
                                                        className="flex items-center justify-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium bg-red-50 px-3 py-2 rounded-md hover:bg-red-100 transition-colors w-full sm:w-auto"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Orders Tab */}
                         {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-800">Order History</h2>

                                {userOrders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-800 mb-2">No orders yet</h3>
                                        <p className="text-slate-600 mb-6">Your order history will appear here once you make your first purchase</p>
                                        <button
                                            onClick={() => router.push('/products')}
                                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {userOrders.map((order) => (
                                            <div
                                                key={order._id}
                                                className="p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        {getOrderStatusIcon(order.orderStatus)}
                                                        <div>
                                                            <h3 className="font-medium text-slate-800">
                                                                Order #{order._id.slice(-8).toUpperCase()}
                                                            </h3>
                                                            <p className="text-sm text-slate-600">
                                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getOrderStatusColor(order.orderStatus)}`}>
                                                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div className="flex items-center space-x-2">
                                                        <CreditCard className="w-4 h-4 text-slate-500" />
                                                        <span className="text-sm text-slate-600">
                                                            Total: <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="w-4 h-4 text-slate-500" />
                                                        <span className="text-sm text-slate-600">
                                                            Items: <span className="font-medium">{order.items.length}</span>
                                                        </span>
                                                    </div>
                                                    {order.trackingNumber && (
                                                        <div className="flex items-center space-x-2">
                                                            <Truck className="w-4 h-4 text-slate-500" />
                                                            <span className="text-sm text-slate-600">
                                                                Tracking: <span className="font-medium">{order.trackingNumber}</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => router.push(`/order-confirmation/${order._id}`)}
                                                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>View Details</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-800">My Wishlist</h2>

                                {wishlistItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-800 mb-2">Your wishlist is empty</h3>
                                        <p className="text-slate-600 mb-6">Add products you love to your wishlist to easily find them later!</p>
                                        <button
                                            onClick={() => router.push('/products')}
                                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                        >
                                            Browse Products
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {wishlistItems.map((product) => (
                                            <div key={product._id} className="relative">
                                                <ProductCard product={product} />
                                                <button
                                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                                    className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 z-10"
                                                    title="Remove from Wishlist"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAddressModal && (
                <AddressModal
                    address={editingAddress}
                    onClose={() => { setShowAddressModal(false); setEditingAddress(null); }}
                    onSubmit={handleAddressFormSubmit}
                />
            )}
        </div>
    );
};

export default UserProfileClient;
