

// pages/login.tsx

"use client"; // This directive is important for client-side components in Next.js App Router

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js App Router
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Mail, Smartphone, Eye, EyeOff, Lock, Phone, Shield, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon from react-icons/fc
import { motion, AnimatePresence } from 'framer-motion';

// Import Firebase functions from the correct relative paths (now .ts)
import { loginWithEmail, loginWithGoogle, onAuthStateChanged } from '../../../components/firebase/firebaseAuth';
import { setupRecaptcha, sendOtp, verifyOtp, resetRecaptcha } from '../../../components/firebase/firebasePhoneAuth';

// Import shadcn/ui components from the correct relative paths
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ConfirmationResult } from 'firebase/auth'; // Import ConfirmationResult type

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional().or(z.literal('')),
  phoneNumber: z.string().regex(/^\+\d{10,15}$/, { message: "Invalid phone number format. Use +CCXXXXXXXXXX" }).optional().or(z.literal('')),
  otp: z.string().min(6, { message: "OTP must be 6 digits." }).max(6, { message: "OTP must be 6 digits." }).optional().or(z.literal('')),
}).refine(data => {
  // Ensure at least one of email/password or phoneNumber is provided for initial login
  if (data.email && data.password) return true;
  if (data.phoneNumber && !data.otp) return true; // Initial phone login
  if (data.phoneNumber && data.otp) return true; // OTP verification
  return false;
}, {
  message: "Provide email/password or phone number for login.",
  path: ["email"] // Attach error to a relevant field
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email'); // 'email', 'phone'
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaContainerId] = useState<string>('recaptcha-container-login'); // Unique ID for recaptcha
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      phoneNumber: '',
      otp: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = form;

  // Listen for auth state changes to redirect authenticated users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: any) => {
      if (user) {
        router.push('/'); // Redirect to dashboard if logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Initialize reCAPTCHA when component mounts and tab is phone
  useEffect(() => {
    if (activeTab === 'phone' && !confirmationResult) {
      // Ensure the reCAPTCHA container is rendered before setting up
      const container = document.getElementById(recaptchaContainerId);
      if (container) {
        setupRecaptcha(recaptchaContainerId);
      }
    }
    return () => {
      // Clean up reCAPTCHA if component unmounts or tab changes
      resetRecaptcha();
    };
  }, [activeTab, confirmationResult, recaptchaContainerId]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (activeTab === 'email') {
        if (!data.email || !data.password) {
          toast.error('Please provide email and password.');
          return;
        }
        await loginWithEmail(data.email, data.password);
        toast.success('Logged in successfully!');
        router.push('/');
      } else if (activeTab === 'phone') {
        if (!data.phoneNumber) {
          toast.error('Please provide a phone number.');
          return;
        }
        if (!confirmationResult) {
          // Step 1: Send OTP
          const verifier = setupRecaptcha(recaptchaContainerId);
          const result = await sendOtp(data.phoneNumber, verifier);
          setConfirmationResult(result);
          toast.success('OTP sent to your phone!');
          setValue('otp', ''); // Clear OTP field for new input
        } else {
          // Step 2: Verify OTP
          if (!data.otp) {
            toast.error('Please enter the OTP.');
            return;
          }
          const user = await verifyOtp(confirmationResult, data.otp);
          toast.success('Phone number verified and logged in successfully!');
          setConfirmationResult(null); // Reset confirmation result
          resetRecaptcha(); // Reset reCAPTCHA
          router.push('/');
        }
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      toast.error(error.message);
      // If OTP verification fails, allow re-entering OTP or resending
      if (activeTab === 'phone' && confirmationResult) {
        setValue('otp', ''); // Clear OTP field
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Google login successful!');
      router.push('/');
    } catch (error: any) {
      console.error('Google Login Error:', error);
      toast.error(error.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { 
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/60 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_70%)]" />
      
      <motion.div
        // variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md mx-auto"
      >
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            <div className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Sign in to your account to continue
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 sm:px-8 mb-6">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('email')}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'email'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </button>
              <button
                onClick={() => setActiveTab('phone')}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'phone'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Phone
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 sm:px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={activeTab}
                // variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {activeTab === 'email' && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        Email Address
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          placeholder="Enter your email"
                          type="email"
                          className="pl-4 pr-4 py-3 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs font-medium text-red-500 flex items-center"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-gray-400" />
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          className="pl-4 pr-12 py-3 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                          {...register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs font-medium text-red-500 flex items-center"
                        >
                          {errors.password.message}
                        </motion.p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing In...
                        </div>
                      ) : (
                        'Sign In with Email'
                      )}
                    </Button>
                  </>
                )}

                {activeTab === 'phone' && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        Phone Number
                      </label>
                      <div className="relative">
                        <Input
                          id="phoneNumber"
                          placeholder="+91 XXXXXXXXXX"
                          type="tel"
                          className="pl-4 pr-4 py-3 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                          {...register("phoneNumber")}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs font-medium text-red-500 flex items-center"
                        >
                          {errors.phoneNumber.message}
                        </motion.p>
                      )}
                    </div>

                    <AnimatePresence>
                      {confirmationResult && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <label htmlFor="otp" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-gray-400" />
                            Verification Code
                          </label>
                          <div className="relative">
                            <Input
                              id="otp"
                              placeholder="Enter 6-digit code"
                              type="text"
                              maxLength={6}
                              className="pl-4 pr-4 py-3 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 text-center text-lg tracking-widest"
                              {...register("otp")}
                            />
                          </div>
                          {errors.otp && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs font-medium text-red-500 flex items-center"
                            >
                              {errors.otp.message}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button 
                      type="submit" 
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : confirmationResult ? (
                        'Verify Code'
                      ) : (
                        'Send Verification Code'
                      )}
                    </Button>

                    {/* reCAPTCHA container */}
                    <div id={recaptchaContainerId} className="flex justify-center mt-4" />
                  </>
                )}
              </motion.form>
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center"
              disabled={isSubmitting}
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>

            {/* Footer Links */}
            <div className="mt-8 space-y-4 text-center">
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/signup" 
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Create Account
                </Link>
              </div>
              <div className="text-sm">
                <Link 
                  href="/reset-password" 
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 text-xs text-gray-600">
            <Shield className="w-3 h-3 mr-2" />
            Your data is secured with end-to-end encryption
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

