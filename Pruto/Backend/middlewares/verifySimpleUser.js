// middlewares/verifySimpleUser.js
// !!! WARNING: THIS MIDDLEWARE IS FOR SHOWCASE/DEMO PURPOSES ONLY.
// !!! IT PROVIDES NO ACTUAL SECURITY AS IT TRUSTS THE CLIENT TO SEND A VALID UID.
// !!! DO NOT USE IN PRODUCTION OR FOR SENSITIVE APPLICATIONS.

module.exports = (req, res, next) => {
    // For a showcase, we assume the frontend *sends* the firebaseUid directly.
    // This could be in the body for POST/PUT, or a query param/custom header for GET.
    // The most common for "auth" would be a custom header like 'X-Firebase-UID'.
    const firebaseUid = req.headers['x-firebase-uid'] || req.body.firebaseUid || req.query.firebaseUid;

    if (!firebaseUid) {
        return res.status(401).json({ message: 'Firebase UID missing. Authentication required (for demo).' });
    }

    // Attach the uid to req.user (or req.auth) so your controllers can access it
    req.user = { uid: firebaseUid }; // Populate req.user.uid

    next(); // Proceed to the next middleware or route handler
};