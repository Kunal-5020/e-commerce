// controllers/authController.js
const { verifyFirebaseIdTokenCustom } = require('../utils/firebaseJwtVerifier'); // New import
const User = require('../models/User'); // Adjust path to your User model

exports.verifyFirebaseIdToken = async (req, res) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res.status(400).json({ error: 'ID Token is required.' });
  }
  // --- Optionally, try to decode it without verification to see its structure ---
  try {
      const decodedPayloadOnly = jwt.decode(idToken);
      console.log('Backend: Decoded ID Token Payload (before verification):', decodedPayloadOnly);
  } catch (decodeErr) {
      console.error('Backend: Failed to decode ID Token payload:', decodeErr.message);
  }

  try {
    // Step 1: Verify ID token using custom verifier
    const decodedToken = await verifyFirebaseIdTokenCustom(idToken);
    const firebaseUid = decodedToken.uid;
    const firebaseEmail = decodedToken.email || ''; // Email might not always be present for phone/anonymous users

    // Firebase Admin SDK used to get full user info
    // You mentioned you want to avoid firebase-admin.
    // If you remove the 'firebase-admin' dependency completely,
    // you won't be able to fetch full `firebaseUser.displayName`, `photoURL`, `phoneNumber` easily from Firebase directly.
    // You'd have to rely on claims present in the ID token or user data passed from frontend (less secure).

    // Option A: If you want to completely remove firebase-admin,
    //           you'll rely only on claims available in the ID token.
    //           Claims like `name`, `picture` are often present for Google sign-in.
    const nameParts = decodedToken.name
      ? decodedToken.name.split(' ')
      : [];
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';
    const profilePicture = decodedToken.picture || ''; // 'picture' claim for photoURL

    // Step 2: Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid });

    // Step 3: Create user if not exists
    if (!user) {
      user = await User.create({
        firebaseUid,
        email: firebaseEmail, // Use email from decoded token
        firstName,
        lastName,
        profilePicture,
        // phoneNumber: firebaseUser.phoneNumber || '', // This would need admin SDK or user to input
        cart: [], // Initialize cart as empty array for new users
      });
    } else {
      // Optional: Update existing user data from token if needed
      // E.g., if a user updates their email in Firebase, you might want to sync it here.
      if (user.email !== firebaseEmail) {
        user.email = firebaseEmail;
        await user.save();
      }
    }

    // Step 4: Return the (existing or newly created) user
    return res.status(200).json({
      message: user ? 'User exists or created successfully' : 'User could not be processed',
      user: user,
    });

  } catch (error) {
    console.error('Error verifying Firebase ID Token or handling user:', error.message);
    let statusCode = 500;
    // Categorize errors from our custom verifier
    if (error.message.includes('Unauthorized: ID Token has expired')) {
      statusCode = 401;
    } else if (error.message.includes('Unauthorized: Invalid ID Token')) {
      statusCode = 401;
    } else if (error.message.includes('ID Token is required')) {
      statusCode = 400;
    }
    res.status(statusCode).json({ error: error.message });
  }
};
