// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String, default: '', trim: true }, // Changed required: true to default: ''
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
    role: { type: String, enum: ['user', 'admin'], default: 'admin' },
    createdAt: { type: Date, default: Date.now } ,
    updatedAt: { type: Date, default: Date.now }
});

// Update the 'updatedAt' field on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
