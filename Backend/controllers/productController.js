const Product = require("../models/Product");

// Get all products
exports.getAll = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// Get product by ID
exports.getById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

// Add product
exports.create = async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(newProduct);
};

// Update
exports.update = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// Delete
exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
