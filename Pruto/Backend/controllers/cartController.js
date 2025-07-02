const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const cart = await Cart.findOne({ user: user._id }).populate('items.product');
        if (!cart) {
            return res.status(200).json({ message: 'Cart is empty or not found.', items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error fetching cart.' });
    }
};

// Add item to cart or update quantity if exists
exports.addItemToCart = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { productId, quantity, selectedSize, selectedColor } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ message: 'Product ID and quantity (min 1) are required.' });
        }

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        let cart = await Cart.findOne({ user: user._id });

        if (!cart) {
            cart = new Cart({ user: user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId &&
            item.selectedSize === selectedSize &&
            JSON.stringify(item.selectedColor) === JSON.stringify(selectedColor)
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].priceAtTimeOfAddition = product.price;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                priceAtTimeOfAddition: product.price,
                selectedSize,
                selectedColor
            });
        }

        await cart.save();
        await cart.populate('items.product');
        res.status(200).json({ message: 'Item added/updated in cart.', cart });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Server error adding item to cart.' });
    }
};

// Update item quantity in cart
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { quantity, selectedSize, selectedColor } = req.body;
        const productId = req.params.productId;

        if (!quantity || quantity < 0) {
            return res.status(400).json({ message: 'Quantity must be a non-negative number.' });
        }

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId &&
            item.selectedSize === selectedSize &&
            JSON.stringify(item.selectedColor) === JSON.stringify(selectedColor)
        );

        if (itemIndex > -1) {
            if (quantity === 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
            await cart.save();
            await cart.populate('items.product');
            res.status(200).json({ message: 'Cart updated successfully.', cart });
        } else {
            res.status(404).json({ message: 'Item not found in cart.' });
        }
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({ message: 'Server error updating cart item.' });
    }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const productId = req.params.productId;
        const { selectedSize, selectedColor } = req.body;

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item =>
            !(item.product.toString() === productId &&
              item.selectedSize === selectedSize &&
              JSON.stringify(item.selectedColor) === JSON.stringify(selectedColor))
        );

        if (cart.items.length < initialLength) {
            await cart.save();
            await cart.populate('items.product');
            res.status(200).json({ message: 'Item removed from cart.', cart });
        } else {
            res.status(404).json({ message: 'Item not found in cart.' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error removing item from cart.' });
    }
};