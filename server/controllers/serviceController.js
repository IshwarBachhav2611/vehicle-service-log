
const ServiceRecord = require("../models/ServiceRecord");
const Vehicle = require("../models/Vehicle");

const getServices = async (req, res) => {
  try {
    const services = await ServiceRecord.find({
      owner: req.user.id,
    })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service records." });
  }
};

const addService = async (req, res) => {
  try {
    const {
      vehicle,
      serviceDate,
      serviceType,
      description,
      odometer,
      cost,
      nextServiceDate,
      nextServiceOdometer,
    } = req.body;

    if (!vehicle || !serviceDate || !serviceType || odometer == null || cost == null) {
      return res.status(400).json({
        message: "Please provide all required service details.",
      });
    }

    // Verify that the selected vehicle belongs to the logged-in user.
    const ownedVehicle = await Vehicle.findOne({
      _id: vehicle,
      owner: req.user.id,
    });

    if (!ownedVehicle) {
      return res.status(404).json({
        message: "Vehicle not found or you do not have permission to use it.",
      });
    }

    const service = await ServiceRecord.create({
      owner: req.user.id,
      vehicle: ownedVehicle._id,
      serviceDate,
      serviceType,
      description,
      odometer,
      cost,
      nextServiceDate: nextServiceDate || null,
      nextServiceOdometer:
        nextServiceOdometer === "" || nextServiceOdometer == null
          ? null
          : nextServiceOdometer,
    });

    const populatedService = await ServiceRecord.findById(service._id)
      .populate("vehicle");

    res.status(201).json(populatedService);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to add service record." });
  }
};

const updateService = async (req, res) => {
  try {
    const {
      vehicle,
      serviceDate,
      serviceType,
      description,
      odometer,
      cost,
      nextServiceDate,
      nextServiceOdometer,
    } = req.body;

    const service = await ServiceRecord.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!service) {
      return res.status(404).json({
        message: "Service record not found or access denied.",
      });
    }

    // If a vehicle is supplied, verify that it belongs to this user.
    if (vehicle !== undefined) {
      const ownedVehicle = await Vehicle.findOne({
        _id: vehicle,
        owner: req.user.id,
      });

      if (!ownedVehicle) {
        return res.status(404).json({
          message: "Vehicle not found or access denied.",
        });
      }

      service.vehicle = ownedVehicle._id;
    }

    if (serviceDate !== undefined) service.serviceDate = serviceDate;
    if (serviceType !== undefined) service.serviceType = serviceType;
    if (description !== undefined) service.description = description;
    if (odometer !== undefined) service.odometer = odometer;
    if (cost !== undefined) service.cost = cost;
    if (nextServiceDate !== undefined) {
      service.nextServiceDate = nextServiceDate || null;
    }
    if (nextServiceOdometer !== undefined) {
      service.nextServiceOdometer =
        nextServiceOdometer === "" || nextServiceOdometer == null
          ? null
          : nextServiceOdometer;
    }

    await service.save();
    await service.populate("vehicle");

    res.status(200).json(service);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to update service record." });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await ServiceRecord.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!service) {
      return res.status(404).json({
        message: "Service record not found or access denied.",
      });
    }

    res.status(200).json({
      message: "Service record deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service record." });
  }
};

module.exports = {
  getServices,
  addService,
  updateService,
  deleteService,
};
