const express = require("express");

const {
  getAppointments,
  getAppointmentById,
  addAppointment,
  updateAppointment,
  deleteAppointment
} = require("../controllers/calendarController");

const router = express.Router();

router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.post("/", addAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;