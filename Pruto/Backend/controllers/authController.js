const admin = require('../firebase/firebaseAdmin');
const User = require('../models/User'); // Adjust path to your User model

exports.verifyFirebaseIdToken = async (req, res) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res.status(400).json({ error: 'ID Token is required.' });
  }

  try {
    // Step 1: Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Step 2: Get full user info from Firebase (optional but good for initial user data)
    const firebaseUser = await admin.auth().getUser(firebaseUid);

    // Step 3: Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid });

    // Step 4: Create user if not exists
    if (!user) {
      const nameParts = firebaseUser.displayName
        ? firebaseUser.displayName.split(' ')
        : [];

      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      user = await User.create({
        firebaseUid,
        email: firebaseUser.email || '',
        firstName,
        lastName,
        profilePicture: firebaseUser.photoURL || '',
        phoneNumber: firebaseUser.phoneNumber || '',
        // Add any other default fields for a new user, e.g., an empty cart
        cart: [], // Initialize cart as empty array for new users
      });
      // Do NOT send a separate 201 response here immediately.
      // We want to consistently return the `user` object in the final step.
    }

    // Step 5: Return the (existing or newly created) user
    // Always return a 200 OK after successfully processing the user
    return res.status(200).json({
      message: user ? 'User exists or created successfully' : 'User could not be processed',
      user: user, // Always return the user object
    });

  } catch (error) {
    console.error('Error verifying Firebase ID Token or handling user:', error.message);
    // Be more specific for token errors vs. database errors if needed
    if (error.code === 'auth/id-token-expired') {
        res.status(401).json({ error: 'Unauthorized: ID Token has expired. Please re-authenticate.' });
    } else if (error.code === 'auth/argument-error') {
        res.status(401).json({ error: 'Unauthorized: Invalid ID Token.' });
    } else {
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
  }
};
