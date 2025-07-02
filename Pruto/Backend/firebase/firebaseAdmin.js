// backend/firebase/firebaseAdmin.js

const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json'); // Path to your downloaded service account key

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e-commerce-3070e-default-rtdb.asia-southeast1.firebasedatabase.app"
});

console.log('Firebase Admin SDK initialized.');

module.exports = admin;