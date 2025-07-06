import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  User as FirebaseUser,
  // No need for getIdToken as we're not sending a token
  User,
  UserCredential,
} from 'firebase/auth';
import { auth, googleProvider } from '../components/firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth';

// Define the shape of your MongoDB user data
interface MongoUser {
  _id: string;
  firebaseUid: string;
  email: string;
  firstName?: string;
  role?: string;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  mongoUser: MongoUser | null;
  // No idToken or customJwt state needed now
  loading: boolean;
  error: string | null;

  signupWithEmail: (email: string, password: string) => Promise<FirebaseUser>;
  loginWithEmail: (email: string, password: string) => Promise<FirebaseUser>;
  loginWithGoogle: () => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;

  // authenticatedFetch will need to be adapted or removed
  authenticatedFetch: (
    url: string,
    options?: RequestInit
  ) => Promise<Response>;

  onAuthStateChanged: (callback: (user: User | null) => void) => (() => void);
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to send UID and Email directly to backend
const syncUserWithBackend = async (
  firebaseUser: FirebaseUser
): Promise<{ mongoUser: MongoUser }> => { // No token returned
  const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // Extract UID and email directly from the FirebaseUser object
  const firebaseUid = firebaseUser.uid;
  const email = firebaseUser.email || ''; // Email might be null for some auth methods

  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send UID and email directly in the body
      body: JSON.stringify({ firebaseUid: firebaseUid, email: email }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Backend user sync successful:', data.message);
      return { mongoUser: data.user }; // Only mongoUser is returned now
    } else {
      console.error('Backend user sync failed:', data.error);
      throw new Error(data.error || 'Failed to sync user with backend');
    }
  } catch (error: any) {
    console.error('Error syncing user with backend:', error);
    throw new Error(`Backend sync error: ${error.message}`);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  // No state for idToken/customJwt
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No need to store token in localStorage
    const storedMongoUser = localStorage.getItem('mongoUser');

    if (storedMongoUser) {
      try {
        setMongoUser(JSON.parse(storedMongoUser));
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        localStorage.removeItem('mongoUser');
      }
    }

    const unsubscribe = firebaseOnAuthStateChanged(auth!, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const { mongoUser: syncedMongoUser } = await syncUserWithBackend(user); // No token returned
          setMongoUser(syncedMongoUser);
          setError(null);
          localStorage.setItem('mongoUser', JSON.stringify(syncedMongoUser));
        } catch (err: any) {
          console.error("Error during initial sync:", err);
          setError(err.message || 'Failed to sync user data.');
          setMongoUser(null);
          firebaseSignOut(auth!);
          localStorage.removeItem('mongoUser');
        }
      } else {
        setMongoUser(null);
        setError(null);
        localStorage.removeItem('mongoUser');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = async (user: FirebaseUser) => {
    try {
      const { mongoUser: syncedMongoUser } = await syncUserWithBackend(user); // No token returned
      setMongoUser(syncedMongoUser);
      setError(null);
      localStorage.setItem('mongoUser', JSON.stringify(syncedMongoUser));
      return user;
    } catch (err: any) {
      setError(err.message || 'Failed to sync user data after login.');
      await firebaseSignOut(auth!);
      throw err;
    }
  };

  const signupWithEmail = useCallback(async (email: string, password: string): Promise<FirebaseUser> => {
    setError(null);
    if (!auth) throw new Error('Firebase Auth not initialized.');
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<FirebaseUser> => {
    setError(null);
    if (!auth) throw new Error('Firebase Auth not initialized.');
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (!userCredential.user.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error('Email not verified. Please verify your email.');
    }
    return handleAuthSuccess(userCredential.user);
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<FirebaseUser> => {
    setError(null);
    if (!auth) throw new Error('Firebase Auth not initialized.');
    if (!googleProvider) throw new Error('Google Provider not initialized.');
    const userCredential: UserCredential = await signInWithPopup(
      auth,
      googleProvider
    );
    return handleAuthSuccess(userCredential.user);
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setError(null);
    if (!auth) throw new Error('Firebase Auth not initialized.');
    await firebaseSignOut(auth);
    setFirebaseUser(null);
    setMongoUser(null);
    localStorage.removeItem('mongoUser'); // No token to remove
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<void> => {
    setError(null);
    if (!auth) throw new Error('Firebase Auth not initialized.');
    await sendPasswordResetEmail(auth, email);
  }, []);

  const resendVerification = useCallback(async (): Promise<void> => {
    setError(null);
    if (!auth || !auth.currentUser) throw new Error('No user is currently logged in.');
    await sendEmailVerification(auth.currentUser);
  }, []);

  // If you have any routes that require an "authenticated" user (even if insecurely),
  // you'll need to decide how to handle this. For a demo, you might just ensure
  // firebaseUser is not null, or remove the 'Authorization' header requirement.
  const authenticatedFetch = useCallback(async (url: string, options?: RequestInit): Promise<Response> => {
    if (!firebaseUser) { // Just check if a Firebase user is logged in
      throw new Error('User not authenticated (for demo purposes).');
    }

    const headers = {
      'Content-Type': 'application/json',
         ...options?.headers,
         // --- Send firebaseUid in a custom header for the backend to read ---
         'X-Firebase-UID': firebaseUser.uid, // This is the key!
    };

    return fetch(url, { ...options, headers });
  }, [firebaseUser]); // Dependency on firebaseUser

  const onAuthStateChanged = (callback: (user: User | null) => void) => {
    if (!auth) {
      console.warn("Firebase Auth not initialized. onAuthStateChanged will not work.");
      return () => {};
    }
    return firebaseOnAuthStateChanged(auth, callback);
  };

  const isAdmin = !!(mongoUser && mongoUser.role === 'admin');

  const value: AuthContextType = {
    firebaseUser,
    mongoUser,
    loading,
    error,
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    signOut,
    resetPassword,
    resendVerification,
    authenticatedFetch,
    onAuthStateChanged,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading Authentication...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};