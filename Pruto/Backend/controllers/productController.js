// controllers/productController.js

const Product = require('../models/Product'); // Import the Product model

// @route GET /api/products
// @desc Get all products
// @access Public
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products.' });
    }
};

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        // Handle CastError for invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        res.status(500).json({ message: 'Server error fetching product.' });
    }
};

// @route POST /api/admin/products
// @desc Create a new product
// @access Private (Admin Only) - Requires admin role middleware
exports.createProduct = async (req, res) => {
    // In a real application, you would have middleware here to check if req.user.role === 'admin'
    try {
        const { name, description, price, category, stockQuantity, images, brand, sizes, colors, sku } = req.body;

        // Basic validation
        if (!name || !description || !price || !category || stockQuantity === undefined) {
            return res.status(400).json({ message: 'Please provide name, description, price, category, and stock quantity.' });
        }
        if (price < 0 || stockQuantity < 0) {
            return res.status(400).json({ message: 'Price and stock quantity cannot be negative.' });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stockQuantity,
            images: images || [], // Default to empty array if not provided
            brand,
            sizes: sizes || [],
            colors: colors || [],
            sku
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully.', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.code === 11000) { // Duplicate key error (e.g., product name or SKU already exists)
            return res.status(409).json({ message: 'A product with this name or SKU already exists.' });
        }
        res.status(500).json({ message: 'Server error creating product.' });
    }
};

// @route PUT /api/admin/products/:id
// @desc Update an existing product
// @access Private (Admin Only) - Requires admin role middleware
exports.updateProduct = async (req, res) => {
    // In a real application, you would have middleware here to check if req.user.role === 'admin'
    try {
        const { id } = req.params;
        const updates = req.body;

        const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product updated successfully.', product });
    } catch (error) {
        console.error('Error updating product:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A product with this name or SKU already exists.' });
        }
        res.status(500).json({ message: 'Server error updating product.' });
    }
};

// @route DELETE /api/admin/products/:id
// @desc Delete a product
// @access Private (Admin Only) - Requires admin role middleware
exports.deleteProduct = async (req, res) => {
    // In a real application, you would have middleware here to check if req.user.role === 'admin'
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        res.status(500).json({ message: 'Server error deleting product.' });
    }
};
