// components/CategoryCard.tsx
'use client'; // This component uses client-side hooks

import React from 'react';
import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation

interface CategoryCardProps {
    category: string;
    imageUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, imageUrl }) => {
    const router = useRouter();
    return (
        <div
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition duration-300"
            onClick={() => router.push(`/products?category=${encodeURIComponent(category)}`)}
        >
            <img src={imageUrl} alt={category} className="w-full h-48 object-cover" />
            <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
            </div>
        </div>
    );
};

export default CategoryCard;
