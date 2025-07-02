// makeAdmin.ts
const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json'); // Path to your downloaded service account key

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin SDK initialized.');

// Replace with your actual Firebase UID
const uid = 'Msk05CnqbgVMQ8NDvhfJKDrv3TA3';

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ User ${uid} has been granted admin rights`);
    process.exit();
  })
  .catch((error) => {
    console.error('❌ Error setting admin claim:', error);
    process.exit(1);
  });
