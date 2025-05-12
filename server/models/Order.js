const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  customerName: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
});
module.exports = mongoose.model('Order', orderSchema);
