const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.use(verifyToken, verifyAdmin);

// Dashboard statistics
router.get("/summary", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const rooms = await Room.countDocuments();
    const bookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({
      status: "Booked"
    });

    res.json({ users, rooms, bookings, activeBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// All users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// All rooms
router.get("/rooms", async (req, res) => {
  try {
    res.json(await Room.find());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// All bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "username email")
      .populate("roomId", "title");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;