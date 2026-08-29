const { appointments } = require("../data/appointments");

let appointmentCounter = 4;

const getAppointments = (req, res) => {
  res.json(appointments);
};

const getAppointmentById = (req, res) => {
  const appointment = appointments.find(
    (a) => a.id === req.params.id
  );

  if (!appointment) {
    return res.status(404).json({
      message: "Appointment not found"
    });
  }

  res.json(appointment);
};

const addAppointment = (req, res) => {
  const {
    customerName,
    vehicleId,
    vehicleModel,
    service,
    date,
    time
  } = req.body;

  if (
    !customerName ||
    !vehicleId ||
    !service ||
    !date ||
    !time
  ) {
    return res.status(400).json({
      message: "customerName, vehicleId, service, date and time are required"
    });
  }

  const newAppointment = {
    id: `A00${appointmentCounter++}`,
    customerName,
    vehicleId,
    vehicleModel: vehicleModel || "",
    service,
    date,
    time,
    status: "Scheduled"
  };

  appointments.push(newAppointment);

  res.status(201).json({
    message: "Appointment created successfully",
    appointment: newAppointment
  });
};

const updateAppointment = (req, res) => {
  const appointment = appointments.find(
    (a) => a.id === req.params.id
  );

  if (!appointment) {
    return res.status(404).json({
      message: "Appointment not found"
    });
  }

  Object.assign(appointment, req.body);

  res.json({
    message: "Appointment updated successfully",
    appointment
  });
};

const deleteAppointment = (req, res) => {
  const index = appointments.findIndex(
    (a) => a.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Appointment not found"
    });
  }

  const deletedAppointment = appointments.splice(index, 1);

  res.json({
    message: "Appointment deleted successfully",
    appointment: deletedAppointment[0]
  });
};

module.exports = {
  getAppointments,
  getAppointmentById,
  addAppointment,
  updateAppointment,
  deleteAppointment
};