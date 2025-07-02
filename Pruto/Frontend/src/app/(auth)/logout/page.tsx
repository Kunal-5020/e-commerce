// pages/logout.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Firebase functions
import { signOut, onAuthStateChanged } from '../../../components/firebase/firebaseAuth';

// Import shadcn/ui components
import { Button } from '../../../components/ui/button';

export default function LogoutPage() {
  const router = useRouter();

  // Redirect to login if already logged out (or if trying to access this page unauthenticated)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (!user) {
        // User is already logged out, redirect to login
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('You have been successfully logged out.');
      // The onAuthStateChanged listener above will handle the redirect to /login
    } catch (error: any) {
      console.error('Logout Error:', error);
      toast.error(error.message || 'Failed to logout.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800">Logout</h2>

        <p className="text-gray-600">
          Are you sure you want to log out?
        </p>

        <Button onClick={handleLogout} className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white">
          <LogOut className="w-4 h-4 mr-2" /> Confirm Logout
        </Button>

        <div className="text-center text-sm text-gray-600 mt-6">
          <Link href="/" className="text-indigo-600 hover:underline">
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
