// components/CategoryCard.tsx
'use client'; // This component uses client-side hooks

import React from 'react';
import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation
import { Icon, ArrowRight } from 'lucide-react';

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
<div className="relative h-48 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <Icon className="w-12 h-12 mx-auto mb-3 opacity-90" iconNode={[]} />
                        <h3 className="text-xl font-bold mb-1">{category}</h3>
                        <p className="text-sm opacity-90">Explore Collection</p>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <ArrowRight className="w-5 h-5 text-white" />
            </div>
        </div>
    );
};

export default CategoryCard;
