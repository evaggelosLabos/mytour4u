const mongoose = require('mongoose');

const priceRequestSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    transferDate: { type: String, required: true }, // store as string (YYYY-MM-DD)
    transferTime: { type: String, required: true }, // store as string (HH:mm)
    passengers: { type: Number, default: 1 },
    status: { type: String, default: 'pending' }, // "pending" | "confirmed"
    price: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PriceRequest', priceRequestSchema);
