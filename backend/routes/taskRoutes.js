const express = require("express");

const {
  getTasksByVehicle,
  addTask,
  updateTask,
  deleteTask,
  moveTask
} = require("../controllers/taskController");

const router = express.Router();

router.get("/:vehicleId", getTasksByVehicle);

router.post("/", addTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

router.patch("/:id/move", moveTask);

module.exports = router;