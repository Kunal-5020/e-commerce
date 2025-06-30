// components/firebase/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA2BPO0H1cyOOjEQ0oNR1kHR_rbxfw6VOI",
  authDomain: "e-commerce-3070e.firebaseapp.com",
  databaseURL: "https://e-commerce-3070e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-commerce-3070e",
  storageBucket: "e-commerce-3070e.firebasestorage.app",
  messagingSenderId: "868640541129",
  appId: "1:868640541129:web:680c33abdd001e8dccc018",
  measurementId: "G-NTG120P31C"
};

// Initialize Firebase App (only once)
let app;
if (typeof window !== 'undefined' && !app) {
  app = initializeApp(firebaseConfig);
}

const auth = app ? getAuth(app) : null;
const googleProvider = app ? new GoogleAuthProvider() : null;

export { auth, googleProvider };