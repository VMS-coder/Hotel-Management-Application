
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/config");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function resetDatabase() {
  try {
    await connectDB();

    console.log("Connected Database:", mongoose.connection.name);
    console.log("WARNING: All data in this database will be deleted!");

    rl.question('Type "RESET" to confirm: ', async (answer) => {
      if (answer === "RESET") {
        await mongoose.connection.dropDatabase();
        console.log("Database reset successfully!");
      } else {
        console.log("Reset cancelled.");
      }

      rl.close();
      await mongoose.disconnect();
    });

  } catch (error) {
    console.log("Error:", error.message);
    rl.close();
    await mongoose.disconnect();
  }
}

resetDatabase();
