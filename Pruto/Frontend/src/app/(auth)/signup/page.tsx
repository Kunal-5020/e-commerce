// pages/signup.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Mail, Smartphone, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Import Firebase functions from the correct relative paths (now .ts)
import { signupWithEmail, loginWithGoogle, onAuthStateChanged } from '../../components/firebase/firebaseAuth';
import { setupRecaptcha, sendOtp, verifyOtp, resetRecaptcha } from '../../components/firebase/firebasePhoneAuth';

// Import shadcn/ui components from the correct relative paths
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ConfirmationResult } from 'firebase/auth'; // Import ConfirmationResult type

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional().or(z.literal('')),
  phoneNumber: z.string().regex(/^\+\d{10,15}$/, { message: "Invalid phone number format. Use +CCXXXXXXXXXX" }).optional().or(z.literal('')),
  otp: z.string().min(6, { message: "OTP must be 6 digits." }).max(6, { message: "OTP must be 6 digits." }).optional().or(z.literal('')),
}).refine(data => {
  // Ensure at least one of email/password or phoneNumber is provided for initial signup
  if (data.email && data.password) return true;
  if (data.phoneNumber && !data.otp) return true; // Initial phone signup
  if (data.phoneNumber && data.otp) return true; // OTP verification
  return false;
}, {
  message: "Provide email/password or phone number for signup.",
  path: ["email"] // Attach error to a relevant field
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email'); // 'email', 'phone'
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaContainerId] = useState<string>('recaptcha-container-signup'); // Unique ID for recaptcha
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      phoneNumber: '',
      otp: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = form;
  const password = watch('password', '');

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
      const container = document.getElementById(recaptchaContainerId);
      if (container) {
        setupRecaptcha(recaptchaContainerId);
      }
    }
    return () => {
      resetRecaptcha();
    };
  }, [activeTab, confirmationResult, recaptchaContainerId]);

  const onSubmit = async (data: SignupFormValues) => {
    try {
      if (activeTab === 'email') {
        if (!data.email || !data.password) {
          toast.error('Please provide email and password.');
          return;
        }
        await signupWithEmail(data.email, data.password);
        toast.success('Signup successful. Please verify your email.');
        router.push('/login'); // Redirect to login after signup
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
          // Step 2: Verify OTP and sign up
          if (!data.otp) {
            toast.error('Please enter the OTP.');
            return;
          }
          const user = await verifyOtp(confirmationResult, data.otp);
          toast.success('Phone number verified and signed up successfully!');
          setConfirmationResult(null); // Reset confirmation result
          resetRecaptcha(); // Reset reCAPTCHA
          router.push('/'); // Redirect to dashboard after successful phone signup
        }
      }
    } catch (error: any) {
      console.error('Signup Error:', error);
      toast.error(error.message);
      if (activeTab === 'phone' && confirmationResult) {
        setValue('otp', ''); // Clear OTP field
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle(); // Google sign-up is essentially login if account exists, or creates new
      toast.success('Google signup successful!');
      router.push('/');
    } catch (error: any) {
      console.error('Google Signup Error:', error);
      toast.error(error.message);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Very Weak', color: 'bg-red-500' },
      { strength: 2, label: 'Weak', color: 'bg-orange-500' },
      { strength: 3, label: 'Fair', color: 'bg-yellow-500' },
      { strength: 4, label: 'Good', color: 'bg-blue-500' },
      { strength: 5, label: 'Strong', color: 'bg-green-500' },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(password ?? "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="w-full max-w-6xl flex items-center justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
          
          {/* Left Side - Branding & Info (Hidden on mobile) */}
          <motion.div
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="hidden lg:flex flex-col justify-center space-y-8 px-8"
>
  <div className="space-y-6">
    {/* Brand Header with Logo */}
    <div className="inline-flex items-center space-x-3">
      <div className=" rounded-xl overflow-hidden bg-white shadow">
        <Image src="/pruto.png" alt="Pruto Logo" width={100} height={100} />
      </div>
    </div>

    {/* Heading + Description */}
    <div className="space-y-4">
      <h2 className="text-4xl font-bold text-slate-800 leading-tight">
        Elevate your shopping experience
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed">
        Explore premium products with real-time inventory, secure checkout, and personalized AI-driven recommendations—all powered by Pruto.
      </p>
    </div>

    {/* Features */}
    <div className="space-y-4">
      {[
        { icon: Shield, text: 'Secure payments & encrypted data' },
        { icon: CheckCircle, text: 'Real-time inventory management' },
        { icon: Mail, text: 'Order updates via email & SMS' }
      ].map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <feature.icon className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-slate-700">{feature.text}</span>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto lg:max-w-lg"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10 space-y-6">
              
              {/* Mobile Header */}
              <div className="lg:hidden text-center space-y-2 mb-6">
                <div className="inline-flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SecureAuth
                  </h1>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Create Account</h2>
                <p className="text-slate-600">Get started with your free account today</p>
              </div>

              {/* Tab Selection */}
              <div className="flex bg-slate-100 rounded-xl p-1 space-x-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('email')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'email'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('phone')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'phone'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Phone</span>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {activeTab === 'email' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="email"
                          placeholder="Enter your email"
                          type="email"
                          className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-500 flex items-center space-x-1">
                          <span>⚠</span>
                          <span>{errors.email.message}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          placeholder="Create a strong password"
                          type={showPassword ? "text" : "password"}
                          className="pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          {...register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="space-y-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                                  level <= passwordStrength.strength ? passwordStrength.color : 'bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          {passwordStrength.label && (
                            <p className="text-xs text-slate-600">
                              Password strength: <span className="font-medium">{passwordStrength.label}</span>
                            </p>
                          )}
                        </div>
                      )}
                      
                      {errors.password && (
                        <p className="text-sm text-red-500 flex items-center space-x-1">
                          <span>⚠</span>
                          <span>{errors.password.message}</span>
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </motion.div>
                )}

                {activeTab === 'phone' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="phoneNumber"
                          placeholder="+91 XXXXXXXXXX"
                          type="tel"
                          className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          {...register("phoneNumber")}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-500 flex items-center space-x-1">
                          <span>⚠</span>
                          <span>{errors.phoneNumber.message}</span>
                        </p>
                      )}
                    </div>

                    {confirmationResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                          Verification Code
                        </label>
                        <Input
                          id="otp"
                          placeholder="Enter 6-digit code"
                          type="text"
                          maxLength={6}
                          className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-center tracking-widest font-mono"
                          {...register("otp")}
                        />
                        {errors.otp && (
                          <p className="text-sm text-red-500 flex items-center space-x-1">
                            <span>⚠</span>
                            <span>{errors.otp.message}</span>
                          </p>
                        )}
                        <p className="text-xs text-slate-600 text-center">
                          We sent a verification code to your phone number
                        </p>
                      </motion.div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : confirmationResult ? (
                        'Verify & Create Account'
                      ) : (
                        'Send Verification Code'
                      )}
                    </Button>

                    <div id={recaptchaContainerId} className="flex justify-center"></div>
                  </motion.div>
                )}
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignup}
                className="w-full h-12 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-3"
                disabled={isSubmitting}
              >
                <FcGoogle className="w-5 h-5" />
                <span className="font-medium">Sign up with Google</span>
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </p>
                <p className="text-xs text-slate-500">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}