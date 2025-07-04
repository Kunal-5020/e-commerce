// lib/authContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../components/firebase/firebase';
import { onAuthStateChanged as firebaseOnAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; // Revert to direct firebase/auth imports for these
import { fetchWithAuth, BASE_API_URL } from './api';
import toast from 'react-hot-toast';

interface UserProfile {
    _id: string;
    firebaseUid: string;
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    shippingAddresses: any[]; // Define a more specific type if needed
    role: 'user' | 'admin'; // Role from MongoDB
    // Add other user profile fields from MongoDB
}

interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null; // MongoDB user profile
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>; // Keep these for context API, but logic removed
    signup: (email: string, password: string) => Promise<void>; // Keep these for context API, but logic removed
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // Function to fetch user profile from your backend with retry logic
    const fetchUserProfileFromBackend = useCallback(async (firebaseUser: User, retries = 3, delay = 1000) => {
        try {
            const idToken = await firebaseUser.getIdToken();
            const response = await fetch(`${BASE_API_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Check if it's a "Not Found" error (e.g., 404) and we have retries left
                if (response.status === 404 && retries > 0) {
                    console.warn(`User profile not found yet for UID: ${firebaseUser.uid}. Retrying in ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    return fetchUserProfileFromBackend(firebaseUser, retries - 1, delay * 2); // Exponential backoff
                }
                const errorData = await response.json();
                console.error("Backend responded with error during profile fetch:", errorData);
                throw new Error(errorData.message || 'Failed to fetch user profile from backend');
            }

            const data: UserProfile = await response.json();
            setUserProfile(data);
            setIsAdmin(data.role === 'admin');
            console.log('Successfully fetched user profile from backend.'); // Success log
        } catch (error: any) {
            console.error('Final error fetching user profile from backend after retries:', error);
            setUserProfile(null);
            setIsAdmin(false);
            // Only show toast if it's a persistent error after retries
            toast.error(`Failed to load user profile: ${error.message}`);
        }
    }, []);

    useEffect(() => {
        if (!auth) {
            console.error("Firebase Auth not initialized. Please check ../components/firebase/firebase.js");
            setLoading(false);
            return;
        }

        const unsubscribe = firebaseOnAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // If Firebase user exists, fetch their profile from backend
                // The fetchUserProfileFromBackend now handles potential initial 404s with retries.
                await fetchUserProfileFromBackend(user);
            } else {
                // Clear user profile and admin status if no Firebase user
                setUserProfile(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [fetchUserProfileFromBackend]);

    // Revert login/signup back to original empty functions if they are handled elsewhere
    const login = async (email: string, password: string) => {
        console.warn("AuthContext login method called, but logic is handled by external firebaseAuth file.");
        // This function exists for the context interface but expects the actual login
        // logic (and backend sync) to happen via a call to your external firebaseAuth.ts file.
        // If you still want to allow basic Firebase auth, uncomment the line below.
        // await signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email: string, password: string) => {
        console.warn("AuthContext signup method called, but logic is handled by external firebaseAuth file.");
        // Similar to login, expects external handling.
        // await createUserWithEmailAndPassword(auth, email, password);
    };
    
    // Removed loginWithGoogle from here based on your request for minimal functions

    const logout = async () => {
        if (!auth) throw new Error("Firebase Auth not initialized.");
        await firebaseSignOut(auth); // Use renamed signOut directly from firebase/auth
    };

    const resetPassword = async (email: string) => {
        if (!auth) throw new Error("Firebase Auth not initialized.");
        await sendPasswordResetEmail(auth, email);
    };

    const value: AuthContextType = {
        currentUser,
        userProfile,
        loading,
        isAdmin,
        login, // These are placeholders for the interface
        signup, // These are placeholders for the interface
        logout,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};