const User = require('../models/User'); // Adjust path to your User model

exports.handleDirectUserSync = async (req, res) => {
  // Expecting firebaseUid and email directly from the frontend
  const { firebaseUid, email } = req.body;

  if (!firebaseUid || !email) {
    return res.status(400).json({ error: 'Firebase UID and email are required.' });
  }

  try {
    // Step 1: Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid });

    // Step 2: Create user if not exists
    if (!user) {
      // Since we are not using Firebase Admin SDK or ID Token claims,
      // we won't have displayName, photoURL, phoneNumber directly.
      // You can set defaults or leave them empty.
      const firstName = 'User'; // Default
      const lastName = '';      // Default

      user = await User.create({
        firebaseUid,
        email,
        firstName,
        lastName,
        profilePicture: '', // No picture from this method
        phoneNumber: '',    // No phone number from this method
        cart: [],
      });
    } else {
      // Optional: Update email if it changed (based on the directly sent email)
      if (user.email !== email) {
        user.email = email;
        await user.save();
      }
    }

    // Step 3: Return the (existing or newly created) user
    return res.status(200).json({
      message: user ? 'User exists or created successfully' : 'User could not be processed',
      user: user,
    });

  } catch (error) {
    console.error('Error handling direct user sync:', error.message);
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};
