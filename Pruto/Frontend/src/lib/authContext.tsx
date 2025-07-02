// lib/authContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../components/firebase/firebase'; // Import auth from your Firebase setup
import { fetchWithAuth, BASE_API_URL } from './api'; // Ensure fetchWithAuth is correctly implemented
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
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
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
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // State for MongoDB profile
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // Function to fetch user profile from your backend
    const fetchUserProfileFromBackend = useCallback(async (firebaseUser: User) => {
        try {
            // Send Firebase ID token to backend for verification and profile retrieval
            const idToken = await firebaseUser.getIdToken();
            const response = await fetch(`${BASE_API_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user profile from backend');
            }

            const data: UserProfile = await response.json();
            setUserProfile(data);
            setIsAdmin(data.role === 'admin'); // Set isAdmin based on MongoDB role
        } catch (error: any) {
            console.error('Error fetching user profile from backend:', error);
            setUserProfile(null);
            setIsAdmin(false); // Default to not admin on error
            toast.error(`Failed to load user profile: ${error.message}`);
        }
    }, []);

    useEffect(() => {
        // Ensure auth object is available before subscribing to auth state changes
        if (!auth) {
            console.error("Firebase Auth not initialized. Please check ../components/firebase/firebase.js");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // If Firebase user exists, fetch their profile from backend
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

    const login = async (email: string, password: string) => {
        if (!auth) throw new Error("Firebase Auth not initialized.");
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle fetching user profile and setting admin status
    };

    const signup = async (email: string, password: string) => {
        if (!auth) throw new Error("Firebase Auth not initialized.");
        await createUserWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle fetching user profile and setting admin status
    };

    const logout = async () => {
        if (!auth) throw new Error("Firebase Auth not initialized.");
        await signOut(auth);
        // onAuthStateChanged will handle clearing user profile and admin status
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
        login,
        signup,
        logout,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
