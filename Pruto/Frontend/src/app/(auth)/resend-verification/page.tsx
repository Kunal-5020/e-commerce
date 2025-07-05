// pages/resend-verification.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
// Import Firebase functions

import { useAuth } from '../../../lib/authContext';
// Assume shadcn/ui components are imported and configured
import { Button } from '../../../components/ui/button';

export default function ResendVerificationPage() {
  const { firebaseUser, resendVerification, onAuthStateChanged } = useAuth();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<typeof firebaseUser | null>(null);
  const [isSending, setIsSending] = useState(false);
  let toastShown = false;
  

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user && user.emailVerified) {
         if (!toastShown) {
        toast.success('Your email is already verified!');
        toastShown = true;
        } 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Email Verification
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                {currentUser && !currentUser.emailVerified
                  ? "We've sent a verification link to your email address"
                  : 'Please log in with an unverified email to resend verification'
                }
              </p>
            </motion.div>
          </div>

          {/* Email Display */}
          {currentUser && !currentUser.emailVerified && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Verification sent to:
                  </p>
                  <p className="text-sm text-blue-600 font-mono truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          {currentUser && !currentUser.emailVerified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-amber-900">
                      Check your inbox
                    </h3>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      The verification email should arrive within a few minutes. Don't forget to check your spam folder if you don't see it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Resend Button */}
              <Button 
                onClick={handleResend} 
                disabled={isSending}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Already Verified State */}
          {currentUser && currentUser.emailVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Email Already Verified!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your email address has been successfully verified.
                </p>
              </div>
            </motion.div>
          )}

          {/* No User State */}
          {!currentUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center space-y-4"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Please log in with an unverified email account to access the verification resend feature.
                </p>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="pt-6 border-t border-gray-100"
          >
            <Link 
              href="/login"
              className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Login</span>
            </Link>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/20 rounded-full blur-sm"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-indigo-400/20 rounded-full blur-sm"></div>
      </motion.div>
    </div>
  );
}