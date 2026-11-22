const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    maxPeople: {
      type: Number,
      required: true,
      min: 1
    },
    roomNumbers: {
      type: [Number],
      default: []
    },
    image: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
