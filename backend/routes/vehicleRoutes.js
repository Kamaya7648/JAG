const express = require("express");

const {
  getVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle
} = require("../controllers/vehicleController");

const router = express.Router();

router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.post("/", addVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;