
const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    serviceType: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    odometer: {
      type: Number,
      required: true,
      min: 0,
    },

    cost: {
      type: Number,
      required: true,
      min: 0,
    },

    nextServiceDate: {
      type: Date,
      default: null,
    },

    nextServiceOdometer: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRecord", serviceRecordSchema);
