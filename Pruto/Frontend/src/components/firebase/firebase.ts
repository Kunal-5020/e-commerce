// components/firebase/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: "AIzaSyA2BPO0H1cyOOjEQ0oNR1kHR_rbxfw6VOI",
//   authDomain: "e-commerce-3070e.firebaseapp.com",
//   databaseURL: "https://e-commerce-3070e-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "e-commerce-3070e",
//   storageBucket: "e-commerce-3070e.firebasestorage.app",
//   messagingSenderId: "868640541129",
//   appId: "1:868640541129:web:680c33abdd001e8dccc018",
//   measurementId: "G-NTG120P31C"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCQad253k1Jz9lCdOp3GcRKh1toMH7XBO0",
  authDomain: "pruto-kunal.firebaseapp.com",
  projectId: "pruto-kunal",
  storageBucket: "pruto-kunal.firebasestorage.app",
  messagingSenderId: "101888484208",
  appId: "1:101888484208:web:ff2b1d77246b1566fb65b5",
  measurementId: "G-WX4038BCH9"
};

// Initialize Firebase App (only once)
let app;
if (typeof window !== 'undefined' && !app) {
  app = initializeApp(firebaseConfig);
}

const auth = app ? getAuth(app) : null;
const googleProvider = app ? new GoogleAuthProvider() : null;

export { auth, googleProvider };