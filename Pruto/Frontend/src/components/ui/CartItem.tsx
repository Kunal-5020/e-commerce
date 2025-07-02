// components/CartItem.tsx
'use client'; // This component uses client-side hooks

import React from 'react';

interface CartItemData {
    product: {
        _id: string;
        name: string;
        price: number;
        images: { url: string; altText: string }[];
    };
    quantity: number;
    selectedSize?: string;
    selectedColor?: { name: string; hexCode: string };
}

interface CartItemProps {
    item: CartItemData;
    updateQuantity: (productId: string, quantity: number, selectedSize?: string | null, selectedColor?: { name: string; hexCode: string } | null) => Promise<void>;
    removeItem: (productId: string, selectedSize?: string | null, selectedColor?: { name: string; hexCode: string } | null) => Promise<void>;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeItem }) => {
    const { product, quantity, selectedSize, selectedColor } = item;

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            updateQuantity(product._id, newQuantity, selectedSize, selectedColor);
        }
    };

    const handleRemove = () => {
        removeItem(product._id, selectedSize, selectedColor);
    };

    return (
        <div className="flex items-center py-4">
            <img
                src={product.images && product.images.length > 0 ? product.images[0].url : `https://placehold.co/100x100/F0F4F8/333333?text=No+Image`}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-md mr-4"
            />
            <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
                {selectedSize && <p className="text-gray-600">Size: {selectedSize}</p>}
                {selectedColor && <p className="text-gray-600">Color: {selectedColor.name}</p>}
            </div>
            <div className="flex items-center space-x-4">
                <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 p-2 border border-gray-300 rounded-md text-center"
                />
                <button
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CartItem;
