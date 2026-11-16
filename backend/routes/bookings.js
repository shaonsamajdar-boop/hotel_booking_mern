const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/', async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;

  try {
    // 1. Check for overlapping dates in the database
    const overlappingBooking = await Booking.findOne({
      roomId: roomId,
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) }
        }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Room is already booked for these dates.' });
    }

    // 2. If no overlap, proceed to save the booking
    const booking = new Booking(req.body);
    const newBooking = await booking.save();
    res.status(201).json(newBooking);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;