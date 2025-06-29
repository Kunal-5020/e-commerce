// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage();