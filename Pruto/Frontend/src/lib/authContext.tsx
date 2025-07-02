"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../components/firebase/firebase'; // Import auth from your Firebase setup

interface AuthContextType {
    currentUser: User | null;
    isAdmin: boolean;
    loading: boolean;
    signup: typeof createUserWithEmailAndPassword;
    login: typeof signInWithEmailAndPassword;
    logout: typeof signOut;
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
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        if (!auth) {
            setCurrentUser(null);
            setIsAdmin(false);
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    const idTokenResult = await user.getIdTokenResult();
                    setIsAdmin(!!idTokenResult.claims.role && idTokenResult.claims.role === 'admin');
                } catch (error) {
                    console.error("Error fetching custom claims:", error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value: AuthContextType = {
        currentUser,
        isAdmin,
        loading,
        signup: createUserWithEmailAndPassword,
        login: signInWithEmailAndPassword,
        logout: signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
