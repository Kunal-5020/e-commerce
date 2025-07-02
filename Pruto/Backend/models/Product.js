const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [
        {
            url: { type: String, required: true },
            altText: { type: String, trim: true }
        }
    ],
    category: { type: String, required: true, trim: true, index: true },
    subCategory: { type: String, trim: true },
    brand: { type: String, trim: true },
    sizes: [{ type: String, trim: true }],
    colors: [{ name: { type: String, trim: true }, hexCode: { type: String, trim: true } }],
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, unique: true, trim: true },
    weight: { type: Number, min: 0 },
    dimensions: { length: { type: Number, min: 0 }, width: { type: Number, min: 0 }, height: { type: Number, min: 0 } },
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    numberOfReviews: { type: Number, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);