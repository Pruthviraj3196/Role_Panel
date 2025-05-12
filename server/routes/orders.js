const express = require('express');
const Order = require('../models/Order');
const { authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authorizeRoles('Manager', 'Employee'), async (req, res) => {
  let orders;
  if (req.user.role === 'Employee') {
    // Fetch only orders created by this employee
    orders = await Order.find({ employee: req.user._id }).populate('product');
  } else {
    // Manager gets all
    orders = await Order.find().populate('product employee');
  }
  res.json(orders);
});


router.post('/', authorizeRoles('Employee'), async (req, res) => {
  const { customerName, product } = req.body;
  const order = await Order.create({ customerName, product, employee: req.user._id });
  res.json(order);
});

router.put('/:id', authorizeRoles('Manager'), async (req, res) => {
  const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;