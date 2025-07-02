// controllers/userController.js

const User = require('../models/User');
const Product = require('../models/Product'); 

// @route GET /api/user/profile
// @desc Get user profile (or create if it doesn't exist)
// @access Private (Authenticated User)
exports.getUserProfile = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        let user = await User.findOne({ firebaseUid });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching/creating user profile:', error);
        res.status(500).json({ message: 'Server error fetching/creating user profile.' });
    }
};

// @route PUT /api/user/profile
// @desc Update user profile
// @access Private (Authenticated User)
exports.updateUserProfile = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const updates = req.body; // Expect updates like firstName, lastName, phone etc.

        // Prevent direct update of firebaseUid or email from here
        delete updates.firebaseUid;
        delete updates.email;
        delete updates.role; // Role updates should be handled separately by admin

        const user = await User.findOneAndUpdate({ firebaseUid }, updates, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found.' });
        }
        res.status(200).json({ message: 'User profile updated successfully.', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error updating user profile.' });
    }
};

// @route POST /api/user/addresses
// @desc Add a new shipping address
// @access Private (Authenticated User)
exports.addShippingAddress = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const newAddress = req.body; // Expect address object
        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        // Basic validation for new address
        if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
            return res.status(400).json({ message: 'All address fields (street, city, state, zipCode, country) are required.' });
        }

        // If 'isDefault' is true, set all other addresses to false
        if (newAddress.isDefault) {
            user.shippingAddresses.forEach(addr => addr.isDefault = false);
        } else if (user.shippingAddresses.length === 0) {
            // If this is the first address, make it default
            newAddress.isDefault = true;
        }

        user.shippingAddresses.push(newAddress);
        await user.save();
        res.status(201).json({ message: 'Shipping address added.', addresses: user.shippingAddresses });
    } catch (error) {
        console.error('Error adding shipping address:', error);
        res.status(500).json({ message: 'Server error adding shipping address.' });
    }
};

// @route PUT /api/user/addresses/:addressId
// @desc Update an existing shipping address
// @access Private (Authenticated User)
exports.updateShippingAddress = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { addressId } = req.params;
        const updates = req.body;

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        const address = user.shippingAddresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Shipping address not found.' });
        }

        // If 'isDefault' is being set to true for this address, unset it for others
        if (updates.isDefault) {
            user.shippingAddresses.forEach(addr => {
                if (addr._id.toString() !== addressId) {
                    addr.isDefault = false;
                }
            });
        }

        // Apply updates
        Object.assign(address, updates);
        await user.save();
        res.status(200).json({ message: 'Shipping address updated.', addresses: user.shippingAddresses });
    } catch (error) {
        console.error('Error updating shipping address:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid address ID format.' });
        }
        res.status(500).json({ message: 'Server error updating shipping address.' });
    }
};

// @route DELETE /api/user/addresses/:addressId
// @desc Delete a shipping address
// @access Private (Authenticated User)
exports.deleteShippingAddress = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { addressId } = req.params;

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        const initialLength = user.shippingAddresses.length;
        user.shippingAddresses.pull({ _id: addressId }); // Mongoose method to remove subdocument by ID

        if (user.shippingAddresses.length === initialLength) {
            return res.status(404).json({ message: 'Shipping address not found.' });
        }

        // If the deleted address was the default, and other addresses exist, set the first one as default
        if (initialLength > 1 && user.shippingAddresses.length > 0 && user.shippingAddresses.every(addr => !addr.isDefault)) {
            user.shippingAddresses[0].isDefault = true;
        }

        await user.save();
        res.status(200).json({ message: 'Shipping address deleted.', addresses: user.shippingAddresses });
    } catch (error) {
        console.error('Error deleting shipping address:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid address ID format.' });
        }
        res.status(500).json({ message: 'Server error deleting shipping address.' });
    }
};

// @route GET /api/user/wishlist
// @desc Get user's wishlist
// @access Private (Authenticated User)
exports.getWishlist = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).populate('wishlist'); // Populate product details
        if (!user) {
            return res.status(404).json({ message: 'User profile not found.' });
        }
        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Server error fetching wishlist.' });
    }
};

// @route POST /api/user/wishlist/:productId
// @desc Add product to wishlist
// @access Private (Authenticated User)
exports.addToWishlist = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const productId = req.params.productId;

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Check if product is already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(409).json({ message: 'Product already in wishlist.' });
        }

        user.wishlist.push(productId);
        await user.save();
        await user.populate('wishlist'); // Populate for immediate response
        res.status(200).json({ message: 'Product added to wishlist.', wishlist: user.wishlist });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        res.status(500).json({ message: 'Server error adding to wishlist.' });
    }
};

// @route DELETE /api/user/wishlist/:productId
// @desc Remove product from wishlist
// @access Private (Authenticated User)
exports.removeFromWishlist = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const productId = req.params.productId;

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        const initialLength = user.wishlist.length;
        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);

        if (user.wishlist.length === initialLength) {
            return res.status(404).json({ message: 'Product not found in wishlist.' });
        }

        await user.save();
        await user.populate('wishlist'); // Populate for immediate response
        res.status(200).json({ message: 'Product removed from wishlist.', wishlist: user.wishlist });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        res.status(500).json({ message: 'Server error removing from wishlist.' });
    }
};
