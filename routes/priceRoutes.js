// routes/priceRoutes.js
const express = require('express');
const router = express.Router();
const PriceRequest = require('../models/PriceRequest');
const Reservation = require('../models/Reservation');
const { sendConfirmationEmail } = require('../utils/mailer');

// Create a new price request (from chat widget / frontend)
router.post('/', async (req, res) => {
  try {
    const pr = new PriceRequest(req.body);
    await pr.save();
    res.json(pr);
  } catch (err) {
    console.error('Error creating price request:', err);
    res.status(500).json({ error: 'Failed to create price request' });
  }
});

// Get all price requests (for AdminDashboard)
router.get('/', async (req, res) => {
  try {
    const requests = await PriceRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Error fetching price requests:', err);
    res.status(500).json({ error: 'Failed to fetch price requests' });
  }
});

// Confirm a price (no reservation yet)
router.post('/confirm', async (req, res) => {
  try {
    const { requestId, price } = req.body;
    const pr = await PriceRequest.findById(requestId);
    if (!pr) return res.status(404).json({ error: 'Price request not found' });

    pr.status = 'confirmed';
    pr.price = price;
    await pr.save();

    res.json({ message: 'Price confirmed', priceRequest: pr });
  } catch (err) {
    console.error('Error confirming price:', err);
    res.status(500).json({ error: 'Failed to confirm price' });
  }
});


module.exports = router;
