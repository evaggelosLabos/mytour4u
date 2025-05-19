// routes/priceRoutes.js
const express = require('express');
const router = express.Router();

let priceRequest = { status: 'pending', price: null, details: null };

router.post('/price-requests', (req, res) => {
  priceRequest = { status: 'pending', price: null, details: req.body };
  res.json({ message: 'Price request received.' });
});

router.get('/price-requests/status', (req, res) => {
  res.json(priceRequest);
});

router.post('/price-requests/confirm', (req, res) => {
  const { price } = req.body;
  priceRequest.status = 'confirmed';
  priceRequest.price = price;
  res.json({ message: 'Price confirmed.' });
});

module.exports = router;
