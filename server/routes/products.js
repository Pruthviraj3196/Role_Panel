const express = require('express');
const Product = require('../models/Product');
const { authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/', authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

router.put('/:id', authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;