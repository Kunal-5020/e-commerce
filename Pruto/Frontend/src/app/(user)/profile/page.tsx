// app/user-profile/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/authContext';
import { fetchWithAuth, BASE_API_URL } from '../../../lib/api';
import AddressModal from '../../../components/AddressModal'; // Import the AddressModal component
import toast from 'react-hot-toast'; // Import toast

// Remove this interface and import the shared ShippingAddress type instead
import type { ShippingAddress } from '../../../components/AddressModal';

interface UserProfileData {
    _id: string;
    firebaseUid: string;
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    shippingAddresses: ShippingAddress[];
    orders: string[]; // Just IDs, will fetch full order details separately
}

interface OrderItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
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


const UserPage: React.FC = () => {
    const { currentUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'profile'); // 'profile', 'addresses', 'orders'
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [profileFormData, setProfileFormData] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    });
    const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
    const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
    const [userOrders, setUserOrders] = useState<Order[]>([]);

    const fetchUserProfile = useCallback(async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setLoading(true);
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
            setLoading(false);
        }
    }, [currentUser, router]);

    const fetchUserOrders = useCallback(async () => {
        if (!currentUser) return;
        try {
            const data: Order[] = await fetchWithAuth(`${BASE_API_URL}/orders`);
            setUserOrders(data);
        } catch (error: any) {
            console.error('Error fetching user orders:', error);
            toast.error(`Failed to load orders: ${error.message}`);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchUserProfile();
        fetchUserOrders();
    }, [fetchUserProfile, fetchUserOrders]);

    // Update active tab if URL query parameter changes
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
        try {
            await fetchWithAuth(`${BASE_API_URL}/user/profile`, {
                method: 'PUT',
                body: JSON.stringify(profileFormData),
            });
            toast.success('Profile updated successfully!');
            setIsEditingProfile(false);
            fetchUserProfile(); // Re-fetch to ensure UI is updated
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(`Failed to update profile: ${error.message}`);
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
            fetchUserProfile(); // Re-fetch profile to update addresses
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

    if (loading) return <div className="text-center p-8 min-h-screen">Loading user profile...</div>;
    if (!currentUser) return <div className="text-center p-8 text-red-500">Please log in to view your account.</div>;
    if (!userProfile) return <div className="text-center p-8 text-red-500">User profile not found.</div>;

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Account</h1>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`py-3 px-6 text-lg font-semibold ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('addresses')}
                        className={`py-3 px-6 text-lg font-semibold ${activeTab === 'addresses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        Addresses
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`py-3 px-6 text-lg font-semibold ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        Orders
                    </button>
                </div>

                {/* Profile Tab Content */}
                {activeTab === 'profile' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                        {isEditingProfile ? (
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-1">First Name</label>
                                    <input type="text" id="firstName" name="firstName" value={profileFormData.firstName} onChange={handleProfileFormChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-1">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" value={profileFormData.lastName} onChange={handleProfileFormChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                                    <input type="text" id="phone" name="phone" value={profileFormData.phone} onChange={handleProfileFormChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email (Cannot be changed here)</label>
                                    <input type="email" id="email" value={userProfile.email} className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" disabled />
                                </div>
                                <div className="flex space-x-4">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Save Changes</button>
                                    <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-3 text-gray-700">
                                <p><strong>Name:</strong> {userProfile.firstName} {userProfile.lastName}</p>
                                <p><strong>Email:</strong> {userProfile.email}</p>
                                <p><strong>Phone:</strong> {userProfile.phone || 'N/A'}</p>
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Addresses Tab Content */}
                {activeTab === 'addresses' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Shipping Addresses</h2>
                        <div className="space-y-4">
                            {userProfile.shippingAddresses.length === 0 ? (
                                <p className="text-gray-600">No shipping addresses found. Please add one.</p>
                            ) : (
                                userProfile.shippingAddresses.map(address => (
                                    <div key={address._id} className="p-4 border border-gray-300 rounded-md">
                                        <p className="font-semibold">{address.addressName || 'Address'}{address.isDefault && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Default</span>}</p>
                                        <p className="text-gray-700">{address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}</p>
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={() => { setEditingAddress(address); setShowAddressModal(true); }}
                                                className="text-blue-500 hover:underline text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => address._id && handleDeleteAddress(address._id)}
                                                className="text-red-500 hover:underline text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button
                            onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Add New Address
                        </button>
                    </div>
                )}

                {/* Orders Tab Content */}
                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
                        {userOrders.length === 0 ? (
                            <p className="text-gray-600">You haven't placed any orders yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {userOrders.map(order => (
                                    <div key={order._id} className="p-4 border border-gray-300 rounded-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold">Order ID: {order._id}</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">Total: ${order.totalAmount.toFixed(2)}</p>
                                        <p className="text-gray-700">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                        <button
                                            onClick={() => router.push(`/order-confirmation/${order._id}`)}
                                            className="mt-2 text-blue-500 hover:underline text-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
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

export default UserPage;
