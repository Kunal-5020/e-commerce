const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    shippingAddresses: [
        {
            addressName: { type: String, trim: true },
            street: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true },
            zipCode: { type: String, required: true, trim: true },
            country: { type: String, required: true, trim: true },
            isDefault: { type: Boolean, default: false }
        }
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);