const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Needed to get current product price if not populating

// Create a new order from cart
exports.createOrder = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const { shippingAddressId, paymentMethod } = req.body;

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const cart = await Cart.findOne({ user: user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cannot create order: Cart is empty.' });
        }

        const selectedAddress = user.shippingAddresses.id(shippingAddressId);
        if (!selectedAddress) {
            return res.status(400).json({ message: 'Invalid shipping address selected.' });
        }

        let totalAmount = 0;
        const orderItems = cart.items.map(cartItem => {
            const product = cartItem.product;
            const itemPrice = product.price;
            totalAmount += itemPrice * cartItem.quantity;
            return {
                product: product._id,
                name: product.name,
                quantity: cartItem.quantity,
                price: itemPrice,
                selectedSize: cartItem.selectedSize,
                selectedColor: cartItem.selectedColor
            };
        });

        const newOrder = new Order({
            user: user._id,
            items: orderItems,
            totalAmount: totalAmount,
            shippingAddress: {
                street: selectedAddress.street,
                city: selectedAddress.city,
                state: selectedAddress.state,
                zipCode: selectedAddress.zipCode,
                country: selectedAddress.country
            },
            paymentMethod: paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'pending'
        });

        await newOrder.save();

        user.orders.push(newOrder._id);
        await user.save();

        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order created successfully!', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error creating order.' });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const orders = await Order.find({ user: user._id }).populate('items.product').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

// Get a single order by ID
exports.getOrderDetail = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const order = await Order.findOne({ _id: req.params.id, user: user._id }).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found or you do not have permission to view it.' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Server error fetching order.' });
    }
};