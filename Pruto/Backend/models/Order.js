const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
            selectedSize: { type: String, trim: true },
            selectedColor: { name: { type: String, trim: true }, hexCode: { type: String, trim: true } }
        }
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    trackingNumber: { type: String, trim: true },
    paymentMethod: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);