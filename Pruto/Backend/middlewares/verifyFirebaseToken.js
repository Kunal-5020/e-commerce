// middlewares/verifyFirebaseToken.js
const admin = require('../firebase/firebaseAdmin');

module.exports = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) return res.status(401).json({ error: 'No token provided' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || '',
    };
    next();
  } catch (error) {
    console.error('Firebase token error:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
