const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Only the configured ADMIN_EMAIL can register as the first admin.
    const isAdmin =
      Boolean(process.env.ADMIN_EMAIL) &&
      normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase().trim();

    const newUser = new User({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      isAdmin
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// Login an existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
