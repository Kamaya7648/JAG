const express = require("express");
const {
  getVehicles,
  getVehicleById,
  createVehicle,
} = require("../controllers/vehicleController");

const router = express.Router();

router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.post("/", createVehicle);

module.exports = router;
