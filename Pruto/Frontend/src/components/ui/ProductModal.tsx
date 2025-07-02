// components/ProductModal.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Import toast

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

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onSubmit: (productData: Product) => Promise<void>;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Product>({
        name: '',
        description: '',
        price: 0,
        images: [],
        category: '',
        brand: '',
        sizes: [],
        colors: [],
        stockQuantity: 0,
        sku: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                images: product.images || [],
                sizes: product.sizes || [],
                colors: product.colors || []
            });
        } else {
            // Reset form for adding a new product
            setFormData({
                name: '',
                description: '',
                price: 0,
                images: [],
                category: '',
                brand: '',
                sizes: [],
                colors: [],
                stockQuantity: 0,
                sku: ''
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Product) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [fieldName]: value.split(',').map(item => item.trim()).filter(item => item !== '')
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'url' | 'altText') => {
        const newImages = [...formData.images];
        newImages[index] = { ...newImages[index], [field]: e.target.value };
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, { url: '', altText: '' }] }));
    };

    const removeImageField = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'name' | 'hexCode') => {
        const newColors = [...formData.colors as { name: string; hexCode: string }[]];
        newColors[index] = { ...newColors[index], [field]: e.target.value };
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const addColorField = () => {
        setFormData(prev => ({ ...prev, colors: [...(prev.colors || []), { name: '', hexCode: '' }] }));
    };

    const removeColorField = (index: number) => {
        setFormData(prev => ({ ...prev, colors: (prev.colors || []).filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.description || formData.price <= 0 || formData.stockQuantity < 0 || !formData.category) {
            toast.error('Please fill in all required product fields correctly.');
            return;
        }
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto py-8">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">Product Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-1">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-gray-700 font-semibold mb-1">Price</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleNumberChange} className="w-full p-2 border border-gray-300 rounded-md" min="0" required />
                        </div>
                        <div>
                            <label htmlFor="stockQuantity" className="block text-gray-700 font-semibold mb-1">Stock Quantity</label>
                            <input type="number" id="stockQuantity" name="stockQuantity" value={formData.stockQuantity} onChange={handleNumberChange} className="w-full p-2 border border-gray-300 rounded-md" min="0" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-gray-700 font-semibold mb-1">Category</label>
                            <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="brand" className="block text-gray-700 font-semibold mb-1">Brand</label>
                            <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="sku" className="block text-gray-700 font-semibold mb-1">SKU</label>
                        <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>

                    {/* Images Section */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Images</label>
                        {formData.images.map((img, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={img.url}
                                    onChange={(e) => handleImageChange(e, index, 'url')}
                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Alt Text"
                                    value={img.altText}
                                    onChange={(e) => handleImageChange(e, index, 'altText')}
                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                />
                                <button type="button" onClick={() => removeImageField(index)} className="text-red-500 hover:text-red-700">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={addImageField} className="mt-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">Add Image</button>
                    </div>

                    {/* Sizes Section */}
                    <div>
                        <label htmlFor="sizes" className="block text-gray-700 font-semibold mb-1">Sizes (comma-separated)</label>
                        <input type="text" id="sizes" name="sizes" value={(formData.sizes || []).join(', ')} onChange={(e) => handleArrayChange(e, 'sizes')} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., S, M, L, XL" />
                    </div>

                    {/* Colors Section */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Colors</label>
                        {(formData.colors || []).map((color, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Color Name (e.g., Red)"
                                    value={color.name}
                                    onChange={(e) => handleColorChange(e, index, 'name')}
                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Hex Code (e.g., #FF0000)"
                                    value={color.hexCode}
                                    onChange={(e) => handleColorChange(e, index, 'hexCode')}
                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                />
                                <button type="button" onClick={() => removeColorField(index)} className="text-red-500 hover:text-red-700">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={addColorField} className="mt-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">Add Color</button>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
