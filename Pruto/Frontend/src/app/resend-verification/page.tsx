// pages/resend-verification.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Firebase functions
import { resendVerification, onAuthStateChanged, User } from '../../components/firebase/firebaseAuth';

// Assume shadcn/ui components are imported and configured
import { Button } from '../../components/ui/button';

export default function ResendVerificationPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user && user.emailVerified) {
        toast.success('Your email is already verified!');
        router.push('/'); // Redirect if already verified
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await resendVerification();
      toast.success('Verification email resent. Please check your inbox.');
    } catch (error) {
      console.error('Resend Verification Error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsSending(false);
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
        <h2 className="text-3xl font-bold text-gray-800">Resend Email Verification</h2>

        <p className="text-gray-600">
          {currentUser && !currentUser.emailVerified
            ? `A verification email was sent to ${currentUser.email}. If you haven't received it, you can resend it.`
            : 'Please log in with an unverified email to resend verification.'
          }
        </p>

        {currentUser && !currentUser.emailVerified && (
          <Button onClick={handleResend} className="w-full" disabled={isSending}>
            <Mail className="w-4 h-4 mr-2" /> {isSending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        )}

        <div className="text-center text-sm text-gray-600 mt-6">
          <Link href="/login" className="text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
