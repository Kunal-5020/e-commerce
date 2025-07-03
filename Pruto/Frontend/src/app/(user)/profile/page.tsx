import React, { Suspense } from 'react';
import UserProfileClient from './UserProfileClient'; // Import your new client component

const UserPage: React.FC = () => {
  return (
    // Wrap the client component in Suspense
    <Suspense fallback={<div>Loading user interface...</div>}>
      <UserProfileClient />
    </Suspense>
  );
};

export default UserPage;