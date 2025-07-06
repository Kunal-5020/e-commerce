// components/ProductModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Product {
    _id?: string;
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

interface ProductFormState extends Omit<Product, 'colors' | 'sizes' | 'images' | 'brand' | 'sku' | 'averageRating' | 'numberOfReviews' | 'isFeatured' | 'isActive' | 'dimensions' | 'weight'> {
    colors: { name: string; hexCode: string }[];
    sizes: string[];
    images: { url: string; altText: string }[];
    brand: string;
    sku: string;
    averageRating: number;
    numberOfReviews: number;
    isFeatured: boolean;
    isActive: boolean;
    dimensions: { length: number; width: number; height: number };
    weight: number;
}


interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onSubmit: (productData: Product) => Promise<void>;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSubmit }) => {
    const initialFormData: ProductFormState = {
        name: '',
        description: '',
        price: 0,
        images: [],
        category: '',
        brand: '',
        sizes: [],
        colors: [],
        stockQuantity: 0,
        sku: '',
        averageRating: 0,
        numberOfReviews: 0,
        isFeatured: false,
        isActive: true,
        dimensions: { length: 0, width: 0, height: 0 },
        weight: 0
    };

    const [formData, setFormData] = useState<ProductFormState>(initialFormData);
    // New state for raw sizes input string
    const [rawSizesInput, setRawSizesInput] = useState<string>('');


    useEffect(() => {
        if (product) {
            const productData = {
                ...initialFormData,
                ...product,
                images: product.images ?? [],
                sizes: product.sizes ?? [],
                colors: product.colors ?? [],
                brand: product.brand ?? '',
                sku: product.sku ?? '',
                averageRating: product.averageRating ?? 0,
                numberOfReviews: product.numberOfReviews ?? 0,
                isFeatured: product.isFeatured ?? false,
                isActive: product.isActive ?? true,
                dimensions: product.dimensions ?? { length: 0, width: 0, height: 0 },
                weight: product.weight ?? 0
            };
            setFormData(productData);
            // Initialize rawSizesInput from product.sizes
            setRawSizesInput(productData.sizes.join(', '));
        } else {
            setFormData(initialFormData);
            setRawSizesInput(''); // Reset for new product
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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, dimension: 'length' | 'width' | 'height') => {
        const value = parseFloat(e.target.value) || 0;
        setFormData(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, [dimension]: value }
        }));
    };

    // Modified handleArrayChange to work with the raw input string
    const handleSizesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRawSizesInput(value); // Update the raw string state immediately
        // Update formData.sizes after a brief delay or on blur, or simply parse here
        // For simplicity, we can parse it here directly.
        setFormData(prev => ({
            ...prev,
            sizes: value.split(',').map(item => item.trim()).filter(item => item !== '')
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
        const newColors = [...formData.colors];
        newColors[index] = { ...newColors[index], [field]: e.target.value };
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const addColorField = () => {
        setFormData(prev => ({ ...prev, colors: [...prev.colors, { name: '', hexCode: '' }] }));
    };

    const removeColorField = (index: number) => {
        setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description || formData.price <= 0 || formData.stockQuantity < 0 || !formData.category) {
            toast.error('Please fill in all required product fields correctly.');
            return;
        }
        await onSubmit(formData as Product);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="px-4 sm:px-6 pb-6">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-4">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Price and Stock */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleNumberChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    id="stockQuantity"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleNumberChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category and Brand */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* SKU */}
                        <div>
                            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                                SKU
                            </label>
                            <input
                                type="text"
                                id="sku"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Rating and Reviews */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="averageRating" className="block text-sm font-medium text-gray-700 mb-1">
                                    Average Rating
                                </label>
                                <input
                                    type="number"
                                    id="averageRating"
                                    name="averageRating"
                                    value={formData.averageRating}
                                    onChange={handleNumberChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <label htmlFor="numberOfReviews" className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Reviews
                                </label>
                                <input
                                    type="number"
                                    id="numberOfReviews"
                                    name="numberOfReviews"
                                    value={formData.numberOfReviews}
                                    onChange={handleNumberChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Product Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleCheckboxChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                                    Featured Product
                                </label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleCheckboxChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                    Active Product
                                </label>
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dimensions (cm)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="length" className="block text-xs text-gray-500 mb-1">Length</label>
                                    <input
                                        type="number"
                                        id="length"
                                        value={formData.dimensions.length}
                                        onChange={(e) => handleDimensionChange(e, 'length')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="width" className="block text-xs text-gray-500 mb-1">Width</label>
                                    <input
                                        type="number"
                                        id="width"
                                        value={formData.dimensions.width}
                                        onChange={(e) => handleDimensionChange(e, 'width')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="height" className="block text-xs text-gray-500 mb-1">Height</label>
                                    <input
                                        type="number"
                                        id="height"
                                        value={formData.dimensions.height}
                                        onChange={(e) => handleDimensionChange(e, 'height')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Weight */}
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleNumberChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* Images Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Images
                            </label>
                            <div className="space-y-3">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Image URL"
                                            value={img.url}
                                            onChange={(e) => handleImageChange(e, index, 'url')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Alt Text"
                                            value={img.altText}
                                            onChange={(e) => handleImageChange(e, index, 'altText')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="w-full sm:w-auto px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addImageField}
                                    className="w-full sm:w-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Add Image
                                </button>
                            </div>
                        </div>

                        {/* Sizes Section - MODIFIED */}
                        <div>
                            <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 mb-1">
                                Sizes (comma-separated)
                            </label>
                            <input
                                type="text"
                                id="sizes"
                                name="sizes"
                                value={rawSizesInput} // Use the new rawSizesInput state
                                onChange={handleSizesInputChange} // Use the new handler
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., S, M, L, XL"
                            />
                        </div>

                        {/* Colors Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Colors
                            </label>
                            <div className="space-y-3">
                                {formData.colors.map((color, index) => (
                                    <div key={index} className="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Color Name (e.g., Red)"
                                            value={color.name}
                                            onChange={(e) => handleColorChange(e, index, 'name')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Hex Code (e.g., #FF0000)"
                                            value={color.hexCode}
                                            onChange={(e) => handleColorChange(e, index, 'hexCode')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeColorField(index)}
                                            className="w-full sm:w-auto px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addColorField}
                                    className="w-full sm:w-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Add Color
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Save Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;