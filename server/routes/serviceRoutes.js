
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getServices,
  addService,
  deleteService,
  updateService,
} = require("../controllers/serviceController");

// Require login for all service routes
router.use(authMiddleware);

router.get("/", getServices);
router.post("/", addService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;
