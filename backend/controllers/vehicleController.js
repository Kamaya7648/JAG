const Vehicle = require('../../database/models/Vehicle');

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      owner: req.user.id,
    }).sort({ createdAt: 1 });

    res.status(200).json(vehicles);
  } catch (err) {
    console.error("Get vehicles error:", err);

    res.status(500).json({
      message: "Failed to fetch vehicles.",
    });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      id: req.params.id,
      owner: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json(vehicle);
  } catch (err) {
    console.error("Get vehicle error:", err);

    res.status(500).json({
      message: "Failed to fetch vehicle.",
    });
  }
};

const addVehicle = async (req, res) => {
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

    if (
      !id ||
      !model ||
      !plate ||
      !customerName ||
      !customerAddress ||
      !phone
    ) {
      return res.status(400).json({
        message: "All required vehicle fields must be provided",
      });
    }

    const existing = await Vehicle.findOne({
      id,
      owner: req.user.id,
    });

    if (existing) {
      return res.status(409).json({
        message: `Vehicle ID "${id}" is already in use.`,
      });
    }

    const vehicle = await Vehicle.create({
      id,
      owner: req.user.id,
      model,
      plate,
      status,
      customerName,
      customerAddress,
      phone,
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (err) {
    console.error("Add vehicle error:", err);

    res.status(500).json({
      message: "Failed to add vehicle.",
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      id: req.params.id,
      owner: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    Object.assign(vehicle, req.body);

    await vehicle.save();

    res.json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (err) {
    console.error("Update vehicle error:", err);

    res.status(500).json({
      message: "Failed to update vehicle.",
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      id: req.params.id,
      owner: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.json({
      message: "Vehicle deleted successfully",
      vehicle,
    });
  } catch (err) {
    console.error("Delete vehicle error:", err);

    res.status(500).json({
      message: "Failed to delete vehicle.",
    });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle,
};