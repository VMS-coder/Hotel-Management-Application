const cron = require("node-cron");
const Booking = require("../models/Booking");

async function completeExpiredBookings() {
  try {
    const result = await Booking.updateMany(
      {
        status: "Booked",
        checkOut: { $lte: new Date() }
      },
      {
        $set: { status: "Completed" }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`${result.modifiedCount} bookings completed`);
    }
  } catch (error) {
    console.log("Booking expiry error:", error.message);
  }
}

// Every hour
cron.schedule("0 * * * *", completeExpiredBookings);

// Also run once when server starts
completeExpiredBookings();

module.exports = completeExpiredBookings;