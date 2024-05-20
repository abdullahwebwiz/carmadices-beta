const express = require("express");
const Product = require("../models/product.model.js"); // Product model import
const router = express.Router();
const {getProducts, getProduct, createProduct} = require("../controllers/product.controller.js"); // Products controller import

// Get
router.get('/', getProducts);
router.get('/:id', getProduct);

// Post
router.post('/', createProduct);

module.exports = router;