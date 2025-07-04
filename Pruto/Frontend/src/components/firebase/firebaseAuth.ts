// components/firebase/firebaseAuth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged, // Renamed to avoid conflict
  User,
  UserCredential,
  getIdToken
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

// Helper to get ID token and send to backend
const sendTokenToBackend = async (user: User) => {
  if (!user) return;
  const idToken = await getIdToken(user);
  // console.log('id token',idToken)
  // Ensure this matches your backend server address
  const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  try {
    const response = await fetch(`${BACKEND_URL}/auth/verify-id-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: idToken }),
    });

    const data = await response.json();

    if (response.ok) {
      // console.log('Backend token verification successful:', data);
      console.log('Backend token verification successful:');
      return { success: true, message: `Backend verified token for UID: ${data.uid}` };
    } else {
      // console.error('Backend token verification failed:', data);
      console.error('Backend token verification failed:');
      return { success: false, message: `Backend verification failed: ${data.error}` };
    }
  } catch (error: any) {
    console.error('Error sending token to backend:', error);
    return { success: false, message: `Error communicating with backend: ${error.message}` };
  }
};

export const signupWithEmail = async (email: string, password: string): Promise<User> => {
  if (!auth) throw new Error("Firebase Auth not initialized.");
  const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential.user;
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  if (!auth) throw new Error("Firebase Auth not initialized.");
  const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
  if (!userCredential.user.emailVerified) {
    await firebaseSignOut(auth); // Log out if email not verified
    throw new Error("Email not verified. Please verify your email.");
  }
  await sendTokenToBackend(userCredential.user);
  return userCredential.user;
};

export const resetPassword = async (email: string): Promise<void> => {
  if (!auth) throw new Error("Firebase Auth not initialized.");
  await sendPasswordResetEmail(auth, email);
};

export const resendVerification = async (): Promise<void> => {
  if (!auth || !auth.currentUser) throw new Error("No user is currently logged in.");
  await sendEmailVerification(auth.currentUser);
};

export const loginWithGoogle = async (): Promise<User> => {
  if (!auth) throw new Error("Firebase Auth not initialized.");
  if (!googleProvider) throw new Error("Google Provider not initialized.");
  const userCredential: UserCredential = await signInWithPopup(auth, googleProvider);
  await sendTokenToBackend(userCredential.user);
  return userCredential.user;
};

export const signOut = async (): Promise<void> => {
  if (!auth) throw new Error("Firebase Auth not initialized.");
  await firebaseSignOut(auth);
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.warn("Firebase Auth not initialized. onAuthStateChanged will not work.");
    return () => {}; // Return a no-op unsubscribe function
  }
  return firebaseOnAuthStateChanged(auth, callback);
};
export type { User };

