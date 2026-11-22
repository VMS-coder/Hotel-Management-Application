const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bookingRoutes = require("./routes/booking");
const connectDB = require("./config/config");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
// Home route
app.get("/", (req, res) => {
  res.send("HotelPro API is running!");
});
//fg
// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`HotelPro server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}

startServer();
