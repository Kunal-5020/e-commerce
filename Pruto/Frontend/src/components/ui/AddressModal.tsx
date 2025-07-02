// components/AddressModal.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect } from 'react';
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

interface AddressModalProps {
    address: ShippingAddress | null;
    onClose: () => void;
    onSubmit: (addressData: ShippingAddress) => Promise<void>;
}

const AddressModal: React.FC<AddressModalProps> = ({ address, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<ShippingAddress>({
        addressName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
    });

    useEffect(() => {
        if (address) {
            setFormData(address);
        } else {
            setFormData({
                addressName: '',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                isDefault: false
            });
        }
    }, [address]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? target.checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
            toast.error('Please fill in all required address fields.');
            return;
        }
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-bold mb-6">{address ? 'Edit Address' : 'Add New Address'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="addressName" className="block text-gray-700 font-semibold mb-1">Address Name (e.g., Home, Work)</label>
                        <input type="text" id="addressName" name="addressName" value={formData.addressName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="street" className="block text-gray-700 font-semibold mb-1">Street</label>
                        <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-gray-700 font-semibold mb-1">City</label>
                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="state" className="block text-gray-700 font-semibold mb-1">State</label>
                            <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="zipCode" className="block text-gray-700 font-semibold mb-1">Zip Code</label>
                            <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-gray-700 font-semibold mb-1">Country</label>
                        <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="mr-2" />
                        <label htmlFor="isDefault" className="text-gray-700 font-semibold">Set as Default Address</label>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Save Address</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
export type { ShippingAddress };

