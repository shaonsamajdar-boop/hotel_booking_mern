const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String }
});

module.exports = mongoose.model('Room', roomSchema);