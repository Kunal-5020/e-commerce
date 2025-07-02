// app/checkout/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/authContext';
import { useCart } from '../../../lib/cartContext';
import { fetchWithAuth, BASE_API_URL } from '../../../lib/api';
import AddressModal from '../../../components/AddressModal'; // Import the AddressModal component
import toast from 'react-hot-toast'; // Import toast

interface ShippingAddress {
    _id: string;
    addressName?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

interface UserProfile {
    _id: string;
    firebaseUid: string;
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    shippingAddresses: ShippingAddress[];
    // Add other user profile fields as needed
}

const CheckoutPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { cartItems, cartTotal, clearCart, fetchCart } = useCart();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentStep, setCurrentStep] = useState<number>(1); // 1: Shipping, 2: Payment, 3: Summary
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
    const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
    const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
    const router = useRouter();

    const fetchUserProfile = useCallback(async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setLoading(true);
        try {
            const data: UserProfile = await fetchWithAuth(`${BASE_API_URL}/user/profile`);
            setUserProfile(data);
            const defaultAddr = data.shippingAddresses.find(addr => addr.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr._id);
            } else if (data.shippingAddresses.length > 0) {
                setSelectedAddressId(data.shippingAddresses[0]._id);
            }
        } catch (error: any) {
            console.error('Error fetching user profile:', error);
            toast.error(`Failed to load profile: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [currentUser, router]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const handleNextStep = () => {
        if (currentStep === 1 && !selectedAddressId) {
            toast.error('Please select a shipping address.');
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const handlePlaceOrder = async () => {
        if (!currentUser) {
            toast.error('Please log in to place an order.');
            return;
        }
        if (cartItems.length === 0) {
            toast.error('Your cart is empty. Cannot place an order.');
            return;
        }
        if (!selectedAddressId) {
            toast.error('Please select a shipping address.');
            return;
        }

        try {
            const orderData = await fetchWithAuth(`${BASE_API_URL}/orders`, {
                method: 'POST',
                body: JSON.stringify({
                    shippingAddressId: selectedAddressId,
                    paymentMethod: paymentMethod,
                }),
            });
            toast.success('Order placed successfully!');
            clearCart();
            fetchCart(); // Re-fetch cart from backend to confirm it's cleared
            router.push(`/order-confirmation/${orderData.order._id}`);
        } catch (error: any) {
            console.error('Error placing order:', error);
            toast.error(`Failed to place order: ${error.message}`);
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


    if (loading) return <div className="text-center p-8 min-h-screen">Loading checkout information...</div>;
    if (!userProfile) return <div className="text-center p-8 text-red-500">User profile not loaded.</div>;
    if (cartItems.length === 0) return (
        <div className="text-center p-8 min-h-screen text-gray-600 text-lg">
            Your cart is empty. <button onClick={() => router.push('/products')} className="text-blue-600 hover:underline">Start shopping!</button>
        </div>
    );

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Progress Indicator */}
                <div className="flex justify-between mb-8 text-center">
                    <div className={`flex-1 ${currentStep >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                        <div className="text-lg">1. Shipping</div>
                        <div className={`h-1 ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'} rounded-full mt-1`}></div>
                    </div>
                    <div className={`flex-1 ${currentStep >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                        <div className="text-lg">2. Payment</div>
                        <div className={`h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'} rounded-full mt-1`}></div>
                    </div>
                    <div className={`flex-1 ${currentStep >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                        <div className="text-lg">3. Summary</div>
                        <div className={`h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'} rounded-full mt-1`}></div>
                    </div>
                </div>

                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                        <div className="space-y-4">
                            {userProfile.shippingAddresses.length === 0 ? (
                                <p className="text-gray-600">No shipping addresses found. Please add one.</p>
                            ) : (
                                userProfile.shippingAddresses.map(address => (
                                    <div
                                        key={address._id}
                                        className={`p-4 border rounded-md cursor-pointer ${selectedAddressId === address._id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                                        onClick={() => setSelectedAddressId(address._id)}
                                    >
                                        <input
                                            type="radio"
                                            id={`address-${address._id}`}
                                            name="shippingAddress"
                                            value={address._id}
                                            checked={selectedAddressId === address._id}
                                            onChange={() => setSelectedAddressId(address._id)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`address-${address._id}`} className="font-semibold">{address.addressName || 'Address'}</label>
                                        <p className="text-gray-700">{address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}</p>
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingAddress(address); setShowAddressModal(true); }}
                                                className="text-blue-500 hover:underline text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address._id); }}
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
                        <div className="flex justify-end mt-8">
                            <button
                                onClick={handleNextStep}
                                disabled={!selectedAddressId}
                                className={`bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold transition duration-300 ${!selectedAddressId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                            >
                                Next: Payment
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
                        <div className="space-y-4">
                            <div
                                className={`p-4 border rounded-md cursor-pointer ${paymentMethod === 'Credit Card' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                                onClick={() => setPaymentMethod('Credit Card')}
                            >
                                <input
                                    type="radio"
                                    id="payment-credit"
                                    name="paymentMethod"
                                    value="Credit Card"
                                    checked={paymentMethod === 'Credit Card'}
                                    onChange={() => setPaymentMethod('Credit Card')}
                                    className="mr-2"
                                />
                                <label htmlFor="payment-credit" className="font-semibold">Credit Card</label>
                                <p className="text-gray-600 text-sm">Visa, Mastercard, American Express</p>
                                {/* Placeholder for credit card form fields */}
                                {paymentMethod === 'Credit Card' && (
                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <label htmlFor="card-number" className="block text-gray-700 text-sm font-medium mb-1">Card Number</label>
                                            <input type="text" id="card-number" placeholder="XXXX XXXX XXXX XXXX" className="w-full p-2 border border-gray-300 rounded-md" />
                                        </div>
                                        <div className="flex space-x-4">
                                            <div className="flex-1">
                                                <label htmlFor="expiry-date" className="block text-gray-700 text-sm font-medium mb-1">Expiry Date</label>
                                                <input type="text" id="expiry-date" placeholder="MM/YY" className="w-full p-2 border border-gray-300 rounded-md" />
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="cvv" className="block text-gray-700 text-sm font-medium mb-1">CVV</label>
                                                <input type="text" id="cvv" placeholder="123" className="w-full p-2 border border-gray-300 rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div
                                className={`p-4 border rounded-md cursor-pointer ${paymentMethod === 'PayPal' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                                onClick={() => setPaymentMethod('PayPal')}
                            >
                                <input
                                    type="radio"
                                    id="payment-paypal"
                                    name="paymentMethod"
                                    value="PayPal"
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={() => setPaymentMethod('PayPal')}
                                    className="mr-2"
                                />
                                <label htmlFor="payment-paypal" className="font-semibold">PayPal</label>
                                <p className="text-gray-600 text-sm">Pay securely with your PayPal account.</p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-400 transition duration-300"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNextStep}
                                className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300"
                            >
                                Next: Order Summary
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Order Summary */}
                {currentStep === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                        <div className="border border-gray-200 rounded-md p-4 mb-6">
                            <h3 className="text-xl font-semibold mb-3">Shipping To:</h3>
                            {selectedAddressId && userProfile.shippingAddresses.find(a => a._id === selectedAddressId) ? (
                                <p className="text-gray-700">
                                    {userProfile.shippingAddresses.find(a => a._id === selectedAddressId)?.street}, <br />
                                    {userProfile.shippingAddresses.find(a => a._id === selectedAddressId)?.city}, {userProfile.shippingAddresses.find(a => a._id === selectedAddressId)?.state} {userProfile.shippingAddresses.find(a => a._id === selectedAddressId)?.zipCode}, <br />
                                    {userProfile.shippingAddresses.find(a => a._id === selectedAddressId)?.country}
                                </p>
                            ) : (
                                <p className="text-red-500">No shipping address selected.</p>
                            )}
                        </div>

                        <div className="border border-gray-200 rounded-md p-4 mb-6">
                            <h3 className="text-xl font-semibold mb-3">Payment Method:</h3>
                            <p className="text-gray-700">{paymentMethod}</p>
                        </div>

                        <div className="border border-gray-200 rounded-md p-4 mb-6">
                            <h3 className="text-xl font-semibold mb-3">Items in Cart:</h3>
                            <ul className="divide-y divide-gray-200">
                                {cartItems.map(item => (
                                    <li key={item.product._id + (item.selectedSize || '') + (item.selectedColor ? item.selectedColor.hexCode : '')} className="py-2 flex justify-between items-center">
                                        <span className="text-gray-700">{item.product.name} (x{item.quantity})</span>
                                        <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between items-center font-bold text-lg">
                                <span>Order Total:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-400 transition duration-300"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-green-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
                            >
                                Place Order
                            </button>
                        </div>
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

export default CheckoutPage;
