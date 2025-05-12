const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
});
module.exports = mongoose.model('Product', productSchema);