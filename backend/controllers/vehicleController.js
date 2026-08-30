const { vehicles } = require("../data/vehicles");

const getVehicles = (req, res) => {
  res.json(vehicles);
};

const getVehicleById = (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);

  if (!vehicle) {
    return res.status(404).json({
      message: "Vehicle not found"
    });
  }

  res.json(vehicle);
};

const addVehicle = (req, res) => {
  const {
    id,
    model,
    plate,
    customerName,
    customerAddress,
    phone
  } = req.body;

  if (!id || !model || !plate || !customerName || !customerAddress || !phone) {
    return res.status(400).json({
      message: "All required vehicle fields must be provided"
    });
  }

  const newVehicle = {
    id: id,
    model: model,
    plate: plate,
    status: req.body.status || "Received",
    customerName: customerName,
    customerAddress: customerAddress,
    phone: phone
  };

  vehicles.push(newVehicle);

  res.status(201).json({
    message: "Vehicle added successfully",
    vehicle: newVehicle
  });
};

const updateVehicle = (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);

  if (!vehicle) {
    return res.status(404).json({
      message: "Vehicle not found"
    });
  }

  Object.assign(vehicle, req.body);

  res.json({
    message: "Vehicle updated successfully",
    vehicle
  });
};

const deleteVehicle = (req, res) => {
  const index = vehicles.findIndex((v) => v.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: "Vehicle not found"
    });
  }

  const deletedVehicle = vehicles.splice(index, 1);

  res.json({
    message: "Vehicle deleted successfully",
    vehicle: deletedVehicle[0]
  });
};

module.exports = {
  getVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle
};