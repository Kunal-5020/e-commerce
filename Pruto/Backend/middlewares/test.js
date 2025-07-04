// middlewares/authAndSyncUser.js

const admin = require('../firebase/firebaseAdmin');
const User = require('../models/User'); // Ensure this path is correct

/**
 * Express middleware to verify Firebase ID token and sync user with the database.
 * 1. Extracts the Bearer token from the Authorization header.
 * 2. Verifies the token using Firebase Admin SDK.
 * 3. Checks if a user with the corresponding Firebase UID exists in the MongoDB database.
 * 4. If the user does not exist, it fetches the full user profile from Firebase and creates a new user in MongoDB.
 * 5. Attaches the resulting user object (from MongoDB) to the `req.user`.
 * 6. Calls `next()` to pass control to the next handler, or sends a 401/500 error if something fails.
 */
module.exports = async (req, res, next) => {
  let idToken;
  // Step 1: Check for Authorization header and extract the token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  }

  if (!idToken) {
    console.log('No token provided in Authorization header.');
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  try {
    // Step 2: Verify the ID token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Step 3: Check if the user already exists in your MongoDB
    let user = await User.findOne({ firebaseUid });

    // Step 4: If the user does not exist, create them in your database
    if (!user) {
      console.log(`User with UID ${firebaseUid} not found in DB. Creating new user.`);
      
      // Fetch the full user record from Firebase to get all details
      const firebaseUser = await admin.auth().getUser(firebaseUid);

      // Prepare user data for your database schema
      const nameParts = firebaseUser.displayName ? firebaseUser.displayName.split(' ') : [];
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      const newUser = {
        firebaseUid,
        email: firebaseUser.email || '',
        firstName,
        lastName,
        profilePicture: firebaseUser.photoURL || '',
        phoneNumber: firebaseUser.phoneNumber || '',
        // Add any other fields from your User model schema
      };

      // Create the user in MongoDB
      user = await User.create(newUser);
      console.log(`Successfully created new user: ${user._id}`);
    }

    // Step 5: Attach the user object (from your DB) to the request object
    req.user = user;

    // Step 6: Pass control to the next middleware/route handler
    return next();

  } catch (error) {
    console.error('Error in authAndSyncUser middleware:', error);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
    }
    // For other types of errors (e.g., database connection issue)
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
};


