// pages/login.tsx

"use client"; // This directive is important for client-side components in Next.js App Router

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js App Router
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Mail, Smartphone } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon from react-icons/fc
import { motion } from 'framer-motion';

// Import Firebase functions from the correct relative paths (now .ts)
import { loginWithEmail, loginWithGoogle, onAuthStateChanged } from '../../components/firebase/firebaseAuth';
import { setupRecaptcha, sendOtp, verifyOtp, resetRecaptcha } from '../../components/firebase/firebasePhoneAuth';

// Import shadcn/ui components from the correct relative paths
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>

        <div className="flex justify-center space-x-2 mb-6">
          <Button
            variant={activeTab === 'email' ? 'default' : 'outline'}
            onClick={() => setActiveTab('email')}
            className="flex-1"
          >
            <Mail className="w-4 h-4 mr-2" /> Email
          </Button>
          <Button
            variant={activeTab === 'phone' ? 'default' : 'outline'}
            onClick={() => setActiveTab('phone')}
            className="flex-1"
          >
            <Smartphone className="w-4 h-4 mr-2" /> Phone
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {activeTab === 'email' && (
            <>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[0.8rem] font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-[0.8rem] font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging In...' : 'Login with Email'}
              </Button>
            </>
          )}

          {activeTab === 'phone' && (
            <>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium leading-none">Phone Number</label>
                <Input
                  id="phoneNumber"
                  placeholder="+1234567890"
                  type="tel"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-[0.8rem] font-medium text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              {confirmationResult && (
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium leading-none">OTP Code</label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    type="text"
                    {...register("otp")}
                  />
                  {errors.otp && (
                    <p className="text-[0.8rem] font-medium text-red-500">
                      {errors.otp.message}
                    </p>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : (confirmationResult ? 'Verify OTP' : 'Send OTP')}
              </Button>
              {/* reCAPTCHA container must be visible for setupRecaptcha */}
              <div id={recaptchaContainerId} className="mt-4"></div>
            </>
          )}
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
          disabled={isSubmitting}
        >
          <FcGoogle className="w-5 h-5 mr-2" /> Login with Google
        </Button>

        <div className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </div>
        <div className="text-center text-sm text-gray-600">
          <Link href="/reset-password" className="text-indigo-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
