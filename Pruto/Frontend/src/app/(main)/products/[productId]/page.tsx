// app/products/[productId]/page.tsx
'use client'; // This component uses client-side hooks

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Use useParams for dynamic routes
import { fetchWithAuth, BASE_API_URL } from '../../../../lib/api';
import { useCart } from '../../../../lib/cartContext';
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
    dimensions?: { length: number; width: number; height: number };
    weight?: number;
    isFeatured?: boolean;
    isActive?: boolean;
}

const ProductDetailPage: React.FC = () => {
    const params = useParams();
    const productId = params.productId as string; // Get productId from URL params
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<{ name: string; hexCode: string } | null>(null);
    const [mainImage, setMainImage] = useState<string>('');
    let toastShown = false;

     useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            setLoading(true);
            try {
                const data: Product = await fetchWithAuth(`${BASE_API_URL}/products/${productId}`);
                setProduct(data);
                setMainImage(data.images && data.images.length > 0 ? data.images[0].url : `https://placehold.co/600x400/F0F4F8/333333?text=No+Image`);
                if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
                if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
            } catch (error: any) {
                console.error('Error fetching product details:', error);
                if (!toastShown) {
    toast.error(`Failed to load products: ${error.message}`);
    toastShown = true;
  }
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;
        if (product.stockQuantity === 0) {
            toast.error('This product is out of stock.');
            return;
        }
        addToCart(product._id, quantity, selectedSize, selectedColor);
        toast.success(`Added ${quantity} ${product.name} to cart!`);
    };

    if (loading) return <div className="text-center p-8">Loading product details...</div>;
    if (!product) return <div className="text-center p-8 text-red-500">Product not found.</div>;

    return (
       <div className="min-h-screen bg-gray-50 py-8">

            <div className="container mx-auto p-8">
                <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg p-6">
                    {/* Product Images */}
                    <div className="md:w-1/2">
                        <img 
                            src={mainImage} 
                            alt={product.name} 
                            className="w-full h-96 object-contain rounded-lg mb-4 shadow-md bg-gray-50" 
                        />
                        <div className="flex space-x-2 overflow-x-auto">
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.url}
                                    alt={img.altText}
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition duration-200 ${
                                        mainImage === img.url ? 'border-blue-500' : 'border-transparent hover:border-blue-500'
                                    }`}
                                    onClick={() => setMainImage(img.url)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="md:w-1/2">
                        <h1 className="text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
                        <p className="text-gray-600 text-lg mb-4">{product.description}</p>
                        
                        {/* Rating and Reviews */}
                        <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400 mr-2">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.floor(product.averageRating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-gray-600">
                                {product.averageRating} ({product.numberOfReviews} reviews)
                            </span>
                        </div>
                        
                        <div className="flex items-center mb-4">
                            <span className="text-3xl font-bold text-blue-600 mr-4">${product.price.toFixed(2)}</span>
                            {product.stockQuantity > 0 ? (
                                <span className="text-green-600 font-semibold">In Stock ({product.stockQuantity})</span>
                            ) : (
                                <span className="text-red-600 font-semibold">Out of Stock</span>
                            )}
                        </div>

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-4">
                                <label htmlFor="size" className="block text-gray-700 font-semibold mb-2">Size:</label>
                                <select
                                    id="size"
                                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    {product.sizes.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Color:</label>
                                <div className="flex space-x-2">
                                    {product.colors.map(color => (
                                        <div
                                            key={color.hexCode}
                                            className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                                                selectedColor && selectedColor.hexCode === color.hexCode 
                                                    ? 'border-blue-500 ring-2 ring-blue-200' 
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            style={{ backgroundColor: color.hexCode }}
                                            onClick={() => setSelectedColor(color)}
                                            title={color.name}
                                        ></div>
                                    ))}
                                </div>
                                {selectedColor && (
                                    <p className="text-sm text-gray-600 mt-1">Selected: {selectedColor.name}</p>
                                )}
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-2">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                max={product.stockQuantity}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stockQuantity, parseInt(e.target.value) || 1)))}
                                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stockQuantity === 0}
                            className={`w-full py-3 rounded-md text-lg font-semibold transition duration-300 ${
                                product.stockQuantity > 0
                                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg transform hover:-translate-y-1'
                                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            }`}
                        >
                            {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>

                        {/* Product Specifications */}
                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Specifications</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                {product.brand && <li><strong>Brand:</strong> {product.brand}</li>}
                                {product.sku && <li><strong>SKU:</strong> {product.sku}</li>}
                                {product.weight && <li><strong>Weight:</strong> {product.weight} kg</li>}
                                {product.dimensions && (
                                    <li>
                                        <strong>Dimensions:</strong> {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height} cm
                                    </li>
                                )}
                                <li><strong>Category:</strong> {product.category}</li>
                                {product.isFeatured && <li><strong>Featured Product:</strong> Yes</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;