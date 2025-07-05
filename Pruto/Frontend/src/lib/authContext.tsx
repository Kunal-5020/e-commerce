// contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'; // Assuming you might use React Router for navigation
import {
  User as FirebaseUser,
  getIdToken,
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

// Define the shape of your MongoDB user data (adjust as per your schema)
interface MongoUser {
  _id: string;
  firebaseUid: string;
  email: string;
  firstName?: string;
  role?: string;
  // Add other user fields you expect from your backend
}

// Define the shape of the authentication context
interface AuthContextType {
  firebaseUser: FirebaseUser | null; // The Firebase User object
  mongoUser: MongoUser | null; // The user data from your MongoDB
  idToken: string | null; // The Firebase ID token
  loading: boolean; // True while initial auth state is being determined
  error: string | null; // Any authentication error

  // Authentication methods
  signupWithEmail: (email: string, password: string) => Promise<FirebaseUser>;
  loginWithEmail: (email: string, password: string) => Promise<FirebaseUser>;
  loginWithGoogle: () => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;

  // Helper for making authenticated requests (Optional, but good practice)
  authenticatedFetch: (
    url: string,
    options?: RequestInit
  ) => Promise<Response>;

  // Add onAuthStateChanged to the context type
  onAuthStateChanged: (callback: (user: User | null) => void) => (() => void);

  // Add isAdmin to the context type
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to send ID token to backend for login/sync
const syncUserWithBackend = async (
  firebaseUser: FirebaseUser
): Promise<{ mongoUser: MongoUser; idToken: string }> => {
  const idToken = await getIdToken(firebaseUser);
  const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  try {
    // This is the dedicated login/sync endpoint
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: idToken }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Backend user sync successful:', data.message);
      // Assuming backend returns the full MongoDB user object
      return { mongoUser: data.user, idToken: idToken };
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
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Firebase Authentication Observers and Initial Load ---
  useEffect(() => {
    // Attempt to load from localStorage initially (for persistence)
    const storedIdToken = localStorage.getItem('idToken');
    const storedMongoUser = localStorage.getItem('mongoUser');

    if (storedIdToken && storedMongoUser) {
      try {
        setIdToken(storedIdToken);
        setMongoUser(JSON.parse(storedMongoUser));
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        // Clear corrupt data if any
        localStorage.removeItem('idToken');
        localStorage.removeItem('mongoUser');
      }
    }


    const unsubscribe = firebaseOnAuthStateChanged(auth!, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          // Whenever Firebase auth state changes to logged in,
          // re-sync with backend to ensure MongoDB user is up-to-date
          const { mongoUser: syncedMongoUser, idToken: newToken } = await syncUserWithBackend(user);
          setMongoUser(syncedMongoUser);
          setIdToken(newToken);
          setError(null);
          // Store in localStorage for persistence across sessions
          localStorage.setItem('idToken', newToken);
          localStorage.setItem('mongoUser', JSON.stringify(syncedMongoUser));
        } catch (err: any) {
          console.error("Error during initial sync:", err);
          setError(err.message || 'Failed to sync user data.');
          setMongoUser(null);
          setIdToken(null);
          // Force sign out if backend sync fails to prevent inconsistent state
          firebaseSignOut(auth!);
          localStorage.removeItem('idToken');
          localStorage.removeItem('mongoUser');
        }
      } else {
        setMongoUser(null);
        setIdToken(null);
        setError(null);
        // Clear stored data on logout
        localStorage.removeItem('idToken');
        localStorage.removeItem('mongoUser');
      }
      setLoading(false); // Auth state determined
    });

    return () => unsubscribe();
  }, []); // Run only once on mount

  // --- Authentication Actions ---

  const handleAuthSuccess = async (user: FirebaseUser) => {
    // After Firebase auth success, immediately sync with backend
    try {
      const { mongoUser: syncedMongoUser, idToken: newToken } = await syncUserWithBackend(user);
      setMongoUser(syncedMongoUser);
      setIdToken(newToken);
      setError(null);
      // Store in localStorage for persistence
      localStorage.setItem('idToken', newToken);
      localStorage.setItem('mongoUser', JSON.stringify(syncedMongoUser));
      return user; // Return firebase user as original functions did
    } catch (err: any) {
      setError(err.message || 'Failed to sync user data after login.');
      // If backend sync fails, sign out from Firebase to avoid inconsistent state
      await firebaseSignOut(auth!);
      throw err; // Re-throw the error to be caught by the caller
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
    // Note: We don't call handleAuthSuccess immediately after signup because
    // the user's email is not yet verified. They'll need to verify and then log in.
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
      await firebaseSignOut(auth); // Log out if email not verified
      throw new Error('Email not verified. Please verify your email.');
    }
    return handleAuthSuccess(userCredential.user); // Sync after successful login
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<FirebaseUser> => {
    setError(null);
    if (!auth) throw new Error('Firebase Auth not initialized.');
    if (!googleProvider) throw new Error('Google Provider not initialized.');
    const userCredential: UserCredential = await signInWithPopup(
      auth,
      googleProvider
    );
    return handleAuthSuccess(userCredential.user); // Sync after successful login
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setError(null);
    if (!auth) throw new Error('Firebase Auth not initialized.');
    await firebaseSignOut(auth);
    setFirebaseUser(null);
    setMongoUser(null);
    setIdToken(null);
    localStorage.removeItem('idToken');
    localStorage.removeItem('mongoUser');
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

  // --- Helper for Authenticated Requests ---
  const authenticatedFetch = useCallback(async (url: string, options?: RequestInit): Promise<Response> => {
    if (!idToken) {
      throw new Error('User not authenticated. No ID token available.');
    }

    const headers = {
      ...options?.headers,
      'Authorization': `Bearer ${idToken}`, // Add the ID token to the header
    };

    return fetch(url, { ...options, headers });
  }, [idToken]); // Re-create if idToken changes

const onAuthStateChanged = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.warn("Firebase Auth not initialized. onAuthStateChanged will not work.");
    return () => {}; // Return a no-op unsubscribe function
  }
  return firebaseOnAuthStateChanged(auth, callback);
};

const isAdmin = !!(mongoUser && mongoUser.role === 'admin');

  const value: AuthContextType = {
    firebaseUser,
    mongoUser,
    idToken,
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
      {/* You might render a loading spinner here */}
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