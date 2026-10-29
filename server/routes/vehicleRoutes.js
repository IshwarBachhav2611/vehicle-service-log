
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

// Require login for all vehicle routes
router.use(authMiddleware);

router.get("/", getVehicles);
router.post("/", addVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;
