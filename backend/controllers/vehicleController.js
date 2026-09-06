const Vehicle = require("../models/Vehicle");

async function getVehicles(req, res) {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: 1 });
    return res.status(200).json(vehicles);
  } catch (err) {
    console.error("Get vehicles error:", err);
    return res.status(500).json({ message: "Failed to fetch vehicles." });
  }
}

async function getVehicleById(req, res) {
  try {
    const vehicle = await Vehicle.findOne({ id: req.params.id });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).json(vehicle);
  } catch (err) {
    console.error("Get vehicle error:", err);
    return res.status(500).json({ message: "Failed to fetch vehicle." });
  }
}

async function createVehicle(req, res) {
  try {
    const {
      id,
      model,
      plate,
      status,
      customerName,
      customerAddress,
      phone,
    } = req.body;

    if (!id || !model || !plate || !customerName || !customerAddress || !phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existing = await Vehicle.findOne({ id });

    if (existing) {
      return res
        .status(409)
        .json({ message: `Vehicle ID "${id}" is already in use.` });
    }

    const vehicle = await Vehicle.create({
      id,
      model,
      plate,
      status,
      customerName,
      customerAddress,
      phone,
    });

    return res.status(201).json(vehicle);
  } catch (err) {
    console.error("Create vehicle error:", err);
    return res.status(500).json({ message: "Failed to add vehicle." });
  }
}

module.exports = { getVehicles, getVehicleById, createVehicle };
