// pages/reset-password.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft, Shield, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Firebase functions from the correct relative paths (now .ts)
import { useAuth } from '../../../lib/authContext';

// Import shadcn/ui components from the correct relative paths
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { resetPassword, onAuthStateChanged } = useAuth();
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = form;
  const emailValue = watch('email');

  // Listen for auth state changes to redirect authenticated users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        router.push('/'); // Redirect to dashboard if logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword(data.email);
      toast.success('Password reset link sent to your email.');
      setSubmittedEmail(data.email);
      setEmailSent(true);
      form.reset(); // Clear form after sending
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      toast.error(error.message);
    }
  };

  const handleSendAnother = () => {
    setEmailSent(false);
    setSubmittedEmail('');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-600/20 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-8">
            {/* Success Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Reset Link Sent!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                  We've sent password reset instructions to your email
                </p>
              </motion.div>
            </div>

            {/* Email Confirmation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Reset link sent to:
                  </p>
                  <p className="text-sm text-emerald-600 font-mono truncate">
                    {submittedEmail}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-blue-900">
                      Next Steps
                    </h3>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>• Check your email inbox (and spam folder)</p>
                      <p>• Click the reset link in the email</p>
                      <p>• Create a new secure password</p>
                      <p>• The link expires in 1 hour for security</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleSendAnother}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-200"
                >
                  Send to Different Email
                </Button>
                
                <Link href="/login">
                  <Button 
                    // variant="ghost"
                    className="w-full h-12 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

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
              <KeyRound className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Reset Password
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
          >
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-semibold text-gray-700 block"
              >
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  placeholder="Enter your email address"
                  type="email"
                  {...register("email")}
                  className={`h-12 pl-12 rounded-xl border-2 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm font-medium">
                    {errors.email.message}
                  </p>
                </motion.div>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || !emailValue}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reset Link
                </>
              )}
            </Button>
          </motion.form>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Security Notice
                </h3>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  For your security, the reset link will expire in 1 hour and can only be used once.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="pt-6 border-t border-gray-100 text-center"
          >
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link 
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/20 rounded-full blur-sm"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-indigo-400/20 rounded-full blur-sm"></div>
      </motion.div>
    </div>
  );
}