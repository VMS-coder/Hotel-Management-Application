const express = require("express");
const mongoose = require("mongoose");
const Room = require("../models/Room");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();

// Get all rooms (public)
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch rooms", error: error.message });
  }
});

// Get one room by its MongoDB ID (public)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch room", error: error.message });
  }
});

// Create a room: admin login token required
router.post("/", verifyToken, verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, maxPeople, roomNumbers, image } = req.body;

    if (!title || !description || price === undefined || maxPeople === undefined) {
      return res.status(400).json({
        message: "title, description, price and maxPeople are required"
      });
    }

   const newRoom = new Room({
  title,
  description,
  price,
  maxPeople,
  roomNumbers: roomNumbers
    ? JSON.parse(roomNumbers)
    : [],
  image: req.file
    ? `/uploads/${req.file.filename}`
    : ""
});

    const savedRoom = await newRoom.save();

    res.status(201).json({
      message: "Room created successfully",
      room: savedRoom
    });
  } catch (error) {
    res.status(500).json({ message: "Could not create room", error: error.message });
  }
});


// Update a room: admin login token required
router.put("/:id", verifyToken, verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    // Check whether ID is valid
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid room ID"
      });
    }

    // Only allow these fields to be updated
    const allowedFields = [
      "title",
      "description",
      "price",
      "maxPeople",
      "roomNumbers",
      "image"
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    // If a new image is uploaded
if (req.file) {
  updateData.image = `/uploads/${req.file.filename}`;
}

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update"
      });
    }

    // Find room and update it
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedRoom) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.status(200).json({
      message: "Room updated successfully",
      room: updatedRoom
    });

  } catch (error) {
    res.status(500).json({
      message: "Could not update room",
      error: error.message
    });
  }
});


// Delete a room: admin login token required
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete room", error: error.message });
  }
});

module.exports = router;
