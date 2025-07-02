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

    // Step 2: Get full user info from Firebase
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
      });

      return res.status(201).json({
        message: 'User created from Firebase',
        user,
      });
    }

    // Step 5: Return existing user
    return res.status(200).json({
      message: 'User exists and token is valid',
      user,
    });

  } catch (error) {
    console.error('Error verifying Firebase ID Token or handling user:', error.message);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired ID Token.' });
  }
};
