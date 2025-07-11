// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your Mongoose User model
const Product = require('../models/Product'); // Assuming you have a Product model

const verifySimpleUser = require('../middlewares/verifySimpleUser');
// Make sure this path is correct relative to admin.js
router.use(verifySimpleUser);

// Middleware to verify Firebase ID Token and check for admin role
const verifyAdmin = async (req, res, next) => {
    // const header = req.headers.authorization;
    // if (!header || !header.startsWith('Bearer ')) {
    //     return res.status(401).json({ message: 'Authorization header missing or malformed' });
    // }

    // const idToken = header.split(' ')[1];
    // if (!idToken) {
    //     return res.status(401).json({ message: 'ID Token missing from header' });
    // }

    try {
        // Use your custom verification function here
        // const decodedToken = await verifyFirebaseIdTokenCustom(idToken);
        // req.user = decodedToken; // Attach decoded token to request (contains uid, email, etc.)
        const firebaseUid = req.headers['x-firebase-uid'] || req.body.firebaseUid || req.query.firebaseUid;

        // Now, fetch the user from MongoDB to check their role
        const userProfile = await User.findOne({ firebaseUid });

        if (!userProfile || userProfile.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Not an administrator' });
        }
        req.userProfile = userProfile; // Attach the full user profile from MongoDB
        next();
    } catch (error) {
        console.error('Error verifying Firebase ID token or checking admin role:', error.message);
        // Provide more specific error messages based on the verification outcome
        let statusCode = 403; // Default to Forbidden
        if (error.message.includes('ID Token has expired')) {
            statusCode = 401; // Unauthorized for expired token
        } else if (error.message.includes('Invalid ID Token')) {
            statusCode = 401; // Unauthorized for invalid token
        }
        return res.status(statusCode).json({ message: 'Authentication failed: ' + error.message });
    }
};

// --- Admin Product Management Routes ---
router.post('/products', verifyAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error creating product', error: error.message });
    }
});

router.put('/products/:id', verifyAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error updating product', error: error.message });
    }
});

router.delete('/products/:id', verifyAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error deleting product', error: error.message });
    }
});


// --- Admin User Management Routes ---

// GET all users (Admin only)
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-shippingAddresses -orders -wishlist -__v');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error fetching users', error: error.message });
    }
});

// PUT update user role (Admin only)
router.put('/users/:userId/role', verifyAdmin, async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent an admin from demoting themselves (optional, but good practice)
        if (user.firebaseUid === req.user.uid && role === 'user') {
            return res.status(403).json({ message: 'Cannot demote yourself.' });
        }

        user.role = role;
        await user.save();
        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error updating user role', error: error.message });
    }
});

// DELETE a user (Admin only)
router.delete('/users/:userId', verifyAdmin, async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent an admin from deleting themselves
        if (user.firebaseUid === req.user.uid) {
            return res.status(403).json({ message: 'Cannot delete your own admin account.' });
        }

        // --- IMPORTANT: Removed Firebase Admin SDK deleteUser call ---
        // If you're not using firebase-admin, you cannot delete from Firebase Auth directly here.
        // You would need to handle this manually or accept that Firebase Auth users will persist.
        // If you *do* want to delete from Firebase, you *must* initialize firebase-admin
        // with a service account key somewhere in your backend (e.g., in your main app.js or config file)
        // and ensure the `admin` object is accessible.
        // For now, I'm assuming you still want to avoid the service account key.
        // If you later decide to use firebase-admin for this, you'll need:
        // const admin = require('firebase-admin'); // And proper initialization

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully from MongoDB.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error deleting user', error: error.message });
    }
});


module.exports = router;