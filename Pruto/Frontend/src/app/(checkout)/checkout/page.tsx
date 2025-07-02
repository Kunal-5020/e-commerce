// app/checkout/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/authContext';
import { useCart } from '../../../lib/cartContext';
import { fetchWithAuth, BASE_API_URL } from '../../../lib/api';
import AddressModal from '../../../components/ui/AddressModal'; // Import the AddressModal component
import toast from 'react-hot-toast'; // Import toast

interface ShippingAddress {
    _id?: string;
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
                setSelectedAddressId(defaultAddr._id ?? '');
            } else if (data.shippingAddresses.length > 0) {
                setSelectedAddressId(data.shippingAddresses[0]._id ?? '');
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

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl text-slate-600">Loading checkout information...</p>
            </div>
        </div>
    );
    
    if (!userProfile) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-xl text-red-500 font-semibold">User profile not loaded.</p>
            </div>
        </div>
    );
    
    if (cartItems.length === 0) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="text-center p-12 bg-white rounded-2xl shadow-xl max-w-md">
                <div className="text-8xl mb-6">🛒</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Your cart is empty</h2>
                <p className="text-slate-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <button 
                    onClick={() => router.push('/products')} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    Start Shopping
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/2 -left-4 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                        Secure Checkout
                    </h1>
                    <p className="text-slate-600 text-lg">Complete your purchase in just a few steps</p>
                </div>

                <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Progress Indicator */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                        <div className="flex justify-between items-center max-w-2xl mx-auto">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-500 ${
                                        currentStep >= step 
                                            ? 'bg-white/30 scale-110' 
                                            : 'bg-white/10'
                                    }`}>
                                        {currentStep > step ? '✓' : step}
                                    </div>
                                    <div className="ml-3 text-white">
                                        <div className="font-semibold">
                                            {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Summary'}
                                        </div>
                                        <div className="text-xs opacity-80">
                                            {step === 1 ? 'Delivery details' : step === 2 ? 'Payment method' : 'Review order'}
                                        </div>
                                    </div>
                                    {step < 3 && (
                                        <div className={`hidden sm:block w-16 h-1 ml-6 rounded-full transition-all duration-500 ${
                                            currentStep > step ? 'bg-white/40' : 'bg-white/20'
                                        }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Step 1: Shipping Information */}
                        {currentStep === 1 && (
                            <div className="animate-fadeIn">
                                <div className="flex items-center mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                                        <span className="text-white text-xl">🚚</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-800">Shipping Information</h2>
                                        <p className="text-slate-600">Where should we deliver your order?</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {userProfile.shippingAddresses.length === 0 ? (
                                        <div className="text-center p-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
                                            <div className="text-6xl mb-4">📍</div>
                                            <p className="text-slate-600 text-lg mb-4">No shipping addresses found</p>
                                            <p className="text-slate-500">Add your first address to continue</p>
                                        </div>
                                    ) : (
                                        userProfile.shippingAddresses.map((address, index) => (
                                            <div
                                                key={address._id}
                                                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                                                    selectedAddressId === address._id 
                                                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg ring-4 ring-blue-100' 
                                                        : 'bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md'
                                                }`}
                                                onClick={() => setSelectedAddressId(address._id ?? '')}
                                            >
                                                <div className="flex items-start">
                                                    <input
                                                        type="radio"
                                                        id={`address-${address._id}`}
                                                        name="shippingAddress"
                                                        value={address._id}
                                                        checked={selectedAddressId === address._id}
                                                        onChange={() => setSelectedAddressId(address._id ?? '')}
                                                        className="mt-1 w-5 h-5 text-blue-600 border-2 border-slate-300 focus:ring-blue-500"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label htmlFor={`address-${address._id}`} className="text-lg font-bold text-slate-800">
                                                                {address.addressName || `Address ${index + 1}`}
                                                            </label>
                                                            {address.isDefault && (
                                                                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-600 leading-relaxed">
                                                            {address.street}<br />
                                                            {address.city}, {address.state} {address.zipCode}<br />
                                                            {address.country}
                                                        </p>
                                                        <div className="flex space-x-4 mt-4">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setEditingAddress(address); setShowAddressModal(true); }}
                                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-200"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); address._id && handleDeleteAddress(address._id); }}
                                                                className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors duration-200"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {selectedAddressId === address._id && (
                                                    <div className="absolute top-4 right-4">
                                                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs">✓</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <button
                                    onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                                    className="w-full sm:w-auto bg-gradient-to-r from-slate-600 to-slate-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg mb-8"
                                >
                                    + Add New Address
                                </button>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleNextStep}
                                        disabled={!selectedAddressId}
                                        className={`px-12 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform ${
                                            !selectedAddressId 
                                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg'
                                        }`}
                                    >
                                        Continue to Payment →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment Information */}
                        {currentStep === 2 && (
                            <div className="animate-fadeIn">
                                <div className="flex items-center mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                                        <span className="text-white text-xl">💳</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-800">Payment Method</h2>
                                        <p className="text-slate-600">Choose how you'd like to pay</p>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div
                                        className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                                            paymentMethod === 'Credit Card' 
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg ring-4 ring-blue-100' 
                                                : 'bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md'
                                        }`}
                                        onClick={() => setPaymentMethod('Credit Card')}
                                    >
                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                id="payment-credit"
                                                name="paymentMethod"
                                                value="Credit Card"
                                                checked={paymentMethod === 'Credit Card'}
                                                onChange={() => setPaymentMethod('Credit Card')}
                                                className="mt-1 w-5 h-5 text-blue-600 border-2 border-slate-300 focus:ring-blue-500"
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label htmlFor="payment-credit" className="text-lg font-bold text-slate-800">Credit Card</label>
                                                    <div className="flex space-x-2">
                                                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                                                        <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                                                        <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 mb-4">Secure payment with your credit or debit card</p>
                                                
                                                {paymentMethod === 'Credit Card' && (
                                                    <div className="mt-6 space-y-4 animate-slideDown">
                                                        <div>
                                                            <label htmlFor="card-number" className="block text-slate-700 font-semibold mb-2">Card Number</label>
                                                            <input 
                                                                type="text" 
                                                                id="card-number" 
                                                                placeholder="1234 5678 9012 3456" 
                                                                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                                                            />
                                                        </div>
                                                        <div className="flex space-x-4">
                                                            <div className="flex-1">
                                                                <label htmlFor="expiry-date" className="block text-slate-700 font-semibold mb-2">Expiry Date</label>
                                                                <input 
                                                                    type="text" 
                                                                    id="expiry-date" 
                                                                    placeholder="MM/YY" 
                                                                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label htmlFor="cvv" className="block text-slate-700 font-semibold mb-2">CVV</label>
                                                                <input 
                                                                    type="text" 
                                                                    id="cvv" 
                                                                    placeholder="123" 
                                                                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {paymentMethod === 'Credit Card' && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                                            paymentMethod === 'PayPal' 
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg ring-4 ring-blue-100' 
                                                : 'bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md'
                                        }`}
                                        onClick={() => setPaymentMethod('PayPal')}
                                    >
                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                id="payment-paypal"
                                                name="paymentMethod"
                                                value="PayPal"
                                                checked={paymentMethod === 'PayPal'}
                                                onChange={() => setPaymentMethod('PayPal')}
                                                className="mt-1 w-5 h-5 text-blue-600 border-2 border-slate-300 focus:ring-blue-500"
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label htmlFor="payment-paypal" className="text-lg font-bold text-slate-800">PayPal</label>
                                                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">PayPal</div>
                                                </div>
                                                <p className="text-slate-600">Fast, secure payment with your PayPal account</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'PayPal' && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="px-8 py-4 bg-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-300 transition-all duration-300 transform hover:scale-105"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        Review Order →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Order Summary */}
                        {currentStep === 3 && (
                            <div className="animate-fadeIn">
                                <div className="flex items-center mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                                        <span className="text-white text-xl">📋</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-800">Order Summary</h2>
                                        <p className="text-slate-600">Review your order before placing it</p>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    {/* Shipping Address */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                            <span className="text-2xl mr-3">🚚</span>
                                            Shipping Address
                                        </h3>
                                        {selectedAddressId && userProfile.shippingAddresses.find(a => a._id === selectedAddressId) ? (
                                            <div className="text-slate-700 leading-relaxed">
                                                {(() => {
                                                    const addr = userProfile.shippingAddresses.find(a => a._id === selectedAddressId)!;
                                                    return (
                                                        <>
                                                            <div className="font-semibold text-lg">{addr.addressName || 'Delivery Address'}</div>
                                                            <div className="mt-2">{addr.street}</div>
                                                            <div>{addr.city}, {addr.state} {addr.zipCode}</div>
                                                            <div>{addr.country}</div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        ) : (
                                            <p className="text-red-500">No shipping address selected.</p>
                                        )}
                                    </div>

                                    {/* Payment Method */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                            <span className="text-2xl mr-3">💳</span>
                                            Payment Method
                                        </h3>
                                        <div className="text-slate-700 text-lg font-semibold">{paymentMethod}</div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                            <span className="text-2xl mr-3">🛍️</span>
                                            Order Items ({cartItems.length} items)
                                        </h3>
                                        <div className="space-y-4">
                                            {cartItems.map(item => (
                                                <div key={item.product._id + (item.selectedSize || '') + (item.selectedColor ? item.selectedColor.hexCode : '')} 
                                                     className="flex justify-between items-center py-4 border-b border-purple-200 last:border-0">
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-slate-800 text-lg">{item.product.name}</div>
                                                        <div className="text-slate-600">Quantity: {item.quantity}</div>
                                                        {item.selectedSize && <div className="text-slate-500 text-sm">Size: {item.selectedSize}</div>}
                                                        {item.selectedColor && <div className="text-slate-500 text-sm">Color: {item.selectedColor.name || item.selectedColor.hexCode}</div>}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-slate-800">${(item.product.price * item.quantity).toFixed(2)}</div>
                                                        <div className="text-slate-500 text-sm">${item.product.price.toFixed(2)} each</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Order Total */}
                                        <div className="mt-8 pt-6 border-t-2 border-purple-200">
                                            <div className="flex justify-between items-center">
                                                <div className="text-2xl font-bold text-slate-800">Total Amount</div>
                                                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                    ${cartTotal.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="text-slate-600 text-right mt-1">Including all taxes and fees</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="px-8 py-4 bg-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-300 transition-all duration-300 transform hover:scale-105"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl text-xl"
                                    >
                                        🎉 Place Order - ${cartTotal.toFixed(2)}
                                    </button>
                                </div>
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

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-slideDown {
                    animation: slideDown 0.4s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;