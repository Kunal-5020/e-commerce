const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            priceAtTimeOfAddition: { type: Number, required: true },
            selectedSize: { type: String, trim: true },
            selectedColor: { name: { type: String, trim: true }, hexCode: { type: String, trim: true } }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);