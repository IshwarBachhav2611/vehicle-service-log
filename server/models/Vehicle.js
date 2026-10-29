
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    make: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    vehicleType: {
      type: String,
      trim: true,
    },

    fuelType: {
      type: String,
      trim: true,
    },

    currentOdometer: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
