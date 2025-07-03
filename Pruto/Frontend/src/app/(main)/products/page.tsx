import React, { Suspense } from 'react';
import UserProfileClient from './ProductClient'; // Import your new client component

const ProductListingPage: React.FC = () => {
  return (
    // Wrap the client component in Suspense
    <Suspense fallback={<div>Loading user interface...</div>}>
      <UserProfileClient />
    </Suspense>
  );
};

export default ProductListingPage;