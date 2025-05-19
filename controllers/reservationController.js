const Reservation = require('../models/Reservation');
const { sendConfirmationEmail } = require('../utils/mailer');

// Create a New Reservation
exports.createReservation = async (req, res) => {
  try {
    const { name, email, phone, pickupLocation, dropoffLocation, transferDate, passengers } = req.body;

    if (!name || !email || !phone || !pickupLocation || !dropoffLocation || !transferDate || !passengers) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const reservation = new Reservation({
      name,
      email,
      phone,
      pickupLocation,
      dropoffLocation,
      transferDate,
      passengers,
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

// Get All Reservations
exports.getReservations = async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { email } : {};
    const reservations = await Reservation.find(filter);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update Reservation Status
exports.updateReservation = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(reservation);
  } catch (err) {
    console.error('Error in updateReservation:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
