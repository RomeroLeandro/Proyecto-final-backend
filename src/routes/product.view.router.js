const express = require('express');
const productViewRouter = express.Router();
const Products = require('../models/product.model');

productViewRouter.get('/', async (req, res) => {
    try {
        const products = await Products.find().lean();
        res.render('products', { products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

productViewRouter.get('/:id', async (req, res) => {
    try {
        const product = await Products.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
        console.log(product);
        res.render('product', { product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} );

module.exports = productViewRouter;