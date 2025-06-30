// backend/controllers/authController.js

const admin = require('../firebase/firebaseAdmin');

exports.verifyFirebaseIdToken = async (req, res) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res.status(400).json({ error: 'ID Token is required.' });
  }

  try {
    // Verify the ID token using the Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);


    console.log('Firebase ID Token verified successfully:', decodedToken.uid);

    res.status(200).json({
      message: 'ID Token verified successfully',
      uid: decodedToken.uid,
      email: decodedToken.email,
      // You can send back more user info if needed
    });
  } catch (error) {
    console.error('Error verifying Firebase ID Token:', error.message);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired ID Token.' });
  }
};

