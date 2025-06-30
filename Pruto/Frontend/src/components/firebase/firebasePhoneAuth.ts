// components/firebase/firebasePhoneAuth.ts

import { RecaptchaVerifier, signInWithPhoneNumber, Auth, ConfirmationResult, User } from 'firebase/auth';
import { auth } from './firebase';

// Declare grecaptcha as a global variable for TypeScript
declare global {
  interface Window {
    grecaptcha: any;
  }
}
declare const grecaptcha: any;

let recaptchaVerifierInstance: RecaptchaVerifier | null = null; // To store the RecaptchaVerifier instance

export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  if (typeof window === 'undefined' || !auth) {
    throw new Error('reCAPTCHA can only be initialized in the browser environment and Firebase Auth must be initialized.');
  }

  // Ensure the reCAPTCHA script is loaded if it's not already
  if (typeof grecaptcha === 'undefined') {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  if (!recaptchaVerifierInstance) {
    recaptchaVerifierInstance = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': (response: string) => {
        console.log("reCAPTCHA solved:", response);
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired");
        if (recaptchaVerifierInstance) {
          recaptchaVerifierInstance.clear();
        }
      }
    });
  }
  return recaptchaVerifierInstance;
};

export const sendOtp = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  if (!auth) throw new Error("Firebase Auth not initialized.");
  const confirmationResult: ConfirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  return confirmationResult;
};

export const verifyOtp = async (confirmationResult: ConfirmationResult, otpCode: string): Promise<User> => {
  if (!confirmationResult) throw new Error("Confirmation result not found. Please send OTP first.");
  const userCredential = await confirmationResult.confirm(otpCode);
  return userCredential.user;
};

export const resetRecaptcha = (): void => {
  if (recaptchaVerifierInstance) {
    recaptchaVerifierInstance.clear();
    recaptchaVerifierInstance = null; // Clear instance after reset
  }
};
