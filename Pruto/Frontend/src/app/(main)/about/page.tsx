// app/about/page.tsx
import React from 'react';

const AboutUsPage: React.FC = () => {
    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">About Pruto</h1>

            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto text-gray-700 leading-relaxed">
                <p className="mb-4">
                    Welcome to **Pruto**, your ultimate destination for high-quality products and an unparalleled shopping experience. Founded in [Year], Pruto was born out of a passion for bringing the best of fashion, electronics, home goods, and more directly to your doorstep.
                </p>
                <p className="mb-4">
                    Our mission is simple: to provide a seamless and enjoyable online shopping journey, offering a curated selection of products that meet our rigorous standards for quality, style, and value. We believe that shopping should be convenient, inspiring, and rewarding.
                </p>
                <p className="mb-4">
                    At Pruto, we are committed to:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                    <li>**Quality:** Sourcing products from trusted brands and manufacturers to ensure durability and satisfaction.</li>
                    <li>**Style:** Staying ahead of trends to bring you the latest and most fashionable items.</li>
                    <li>**Customer Satisfaction:** Providing exceptional customer service and support, because your happiness is our priority.</li>
                    <li>**Innovation:** Continuously improving our platform and offerings to enhance your shopping experience.</li>
                </ul>
                <p className="mb-4">
                    We are more than just an e-commerce platform; we are a community built around shared values of quality, style, and convenience. Thank you for choosing Pruto. We look forward to serving you and becoming your go-to online store.
                </p>
                <p className="text-center font-semibold mt-6">
                    Happy Shopping! <br />
                    The Pruto Team
                </p>
            </div>
        </div>
    );
};

export default AboutUsPage;
