// Import the functions you need from the SDKs you need
const { initializeApp }  = require ("firebase/app");
const { getAnalytics } = require ("firebase/analytics");
const { getFirestore } = require ("firebase/firestore");
const{
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} = require ("firebase/auth");

const {getStorage} = require ("firebase/storage");



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
// const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();


 const db = getFirestore(app);
 const auth = getAuth(app);
 const storage = getStorage();

module.exports = {
  auth,
  googleProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  db,
  storage,
  // analytics,
  app
};