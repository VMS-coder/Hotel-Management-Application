const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

const getUserId = (req) => req.user.id || req.user._id || req.user.userId;

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { roomId, roomNumber, checkIn, checkOut } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "User information not found" });
    }

    if (!roomId || roomNumber === undefined || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Please provide all booking details" });
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      endDate <= startDate
    ) {
      return res.status(400).json({ message: "Check-out date must be after check-in date" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const selectedRoomNumber = Number(roomNumber);
    if (!room.roomNumbers.includes(selectedRoomNumber)) {
      return res.status(400).json({ message: "Invalid room number" });
    }

    // Prevent overlapping bookings for the same room number
    const existingBooking = await Booking.findOne({
      roomId,
      roomNumber: selectedRoomNumber,
      status: "Booked",
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate }
    });

    if (existingBooking) {
      return res.status(409).json({ message: "This room is already booked for the selected dates" });
    }

    // Total days and amount are calculated on the server
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.ceil((endDate - startDate) / millisecondsPerDay);
    const totalAmount = totalDays * room.price;

    const booking = await Booking.create({
      roomId,
      userId,
      roomNumber: selectedRoomNumber,
      checkIn: startDate,
      checkOut: endDate,
      totalDays,
      totalAmount
    });

    res.status(201).json({ message: "Room booked successfully", booking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Unable to create booking", error: error.message });
  }
};

// GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: getUserId(req) })
      .populate("roomId", "title image price")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
};

// DELETE /api/bookings/:id  (cancel own booking)
exports.cancelBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: getUserId(req)
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Unable to cancel booking" });
  }
};
