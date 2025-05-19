const express = require('express');
const { createReservation, getReservations, updateReservation } = require('../controllers/reservationController');
const router = express.Router();

console.log({ createReservation, getReservations, updateReservation }); // 👈 Add this line!

router.post('/', createReservation);
router.get('/', getReservations);
router.put('/:id', updateReservation);

module.exports = router;
