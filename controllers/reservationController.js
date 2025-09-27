const Reservation = require('../models/Reservation');
const PriceRequest = require('../models/PriceRequest');
const { sendConfirmationEmail } = require('../utils/mailer');

/**
 * Create a New Reservation (direct bookings e.g. from Destinations page)
 */
exports.createReservation = async (req, res) => {
  try {
    const { name, email, phone, pickupLocation, dropoffLocation, transferDate, passengers, transferTime } = req.body;

    if (!name || !email || !phone || !pickupLocation || !dropoffLocation || !transferDate || !transferTime || !passengers) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const reservation = new Reservation({
      name,
      email,
      phone,
      pickupLocation,
      dropoffLocation,
      transferDate,
      transferTime,
      passengers,
      status: 'confirmed', // direct bookings are auto-confirmed
    });

    await reservation.save();

    // Send Confirmation Email
    const subject = '🚐 Your Corfiot Transfer is Confirmed!';
    const text = `
Dear ${name},

Thank you for booking with Corfiot Transfers!

📍 Pickup: ${pickupLocation}
📍 Drop-off: ${dropoffLocation}
📅 Date: ${transferDate}
⏰ Time: ${transferTime}
👥 Passengers: ${passengers}

We’ll be there on time to provide you with a premium transfer experience.

Safe travels,  
Corfiot Transfers Team
    `;

    await sendConfirmationEmail(email, subject, text);

    res.json(reservation);
  } catch (err) {
    console.error('Error in createReservation:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Get All Reservations
 */
exports.getReservations = async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { email } : {};
    const reservations = await Reservation.find(filter).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    console.error('Error in getReservations:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update Reservation Status (pending, confirmed, completed)
 */
exports.updateReservation = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    console.error('Error in updateReservation:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Confirm a Price Request → Convert into Reservation + Send Email
 */
exports.confirmPrice = async (req, res) => {
  try {
    const { requestId, price } = req.body;

    if (!requestId || !price) {
      return res.status(400).json({ error: 'Request ID and price are required.' });
    }

    // Find price request
    const request = await PriceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Price request not found.' });
    }

    // Mark request as confirmed
    request.status = 'confirmed';
    request.price = price;
    await request.save();

    // Create Reservation from Price Request
    const reservation = new Reservation({
      name: request.name || '—',
      email: request.email || '—',
      phone: request.phone || '—',
      pickupLocation: request.pickupLocation,
      dropoffLocation: request.dropoffLocation,
      transferDate: request.transferDate || request.date,
      transferTime: request.transferTime || request.time,
      passengers: request.passengers || 1,
      price,
      status: 'confirmed',
    });

    await reservation.save();

    // Send Confirmation Email (only if email exists)
    if (reservation.email && reservation.email !== '—') {
      const subject = '🚐 Your Corfiot Transfer is Confirmed!';
      const text = `
Dear ${reservation.name},

Thank you for booking with Corfiot Transfers!

📍 Pickup: ${reservation.pickupLocation}
📍 Drop-off: ${reservation.dropoffLocation}
📅 Date: ${reservation.transferDate}
⏰ Time: ${reservation.transferTime}
👥 Passengers: ${reservation.passengers}
💶 Price: €${price}

We’ll be there on time to provide you with a premium transfer experience.

Safe travels,  
Corfiot Transfers Team
      `;

      await sendConfirmationEmail(reservation.email, subject, text);
    }

    res.json({ success: true, reservation });
  } catch (err) {
    console.error('Error in confirmPrice:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
