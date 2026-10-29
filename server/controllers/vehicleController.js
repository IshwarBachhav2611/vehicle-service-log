
const Vehicle = require("../models/Vehicle");

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicles." });
  }
};

const addVehicle = async (req, res) => {
  try {
    const {
      registrationNumber,
      make,
      model,
      year,
      vehicleType,
      fuelType,
      currentOdometer,
    } = req.body;

    if (!registrationNumber || !make || !model || !year) {
      return res.status(400).json({
        message: "Registration number, make, model, and year are required.",
      });
    }

    const vehicle = await Vehicle.create({
      owner: req.user.id,
      registrationNumber,
      make,
      model,
      year,
      vehicleType,
      fuelType,
      currentOdometer,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A vehicle with this registration number already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to add vehicle." });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const {
      registrationNumber,
      make,
      model,
      year,
      vehicleType,
      fuelType,
      currentOdometer,
    } = req.body;

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      {
        registrationNumber,
        make,
        model,
        year,
        vehicleType,
        fuelType,
        currentOdometer,
      },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found or you do not have permission to update it.",
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to update vehicle." });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found or you do not have permission to delete it.",
      });
    }

    res.status(200).json({ message: "Vehicle deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vehicle." });
  }
};

module.exports = {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
};
