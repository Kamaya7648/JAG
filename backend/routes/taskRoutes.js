const express = require("express");
const {
  getTasksByVehicle,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/:vehicleId", getTasksByVehicle);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id/move", moveTask);
router.delete("/:id", deleteTask);

module.exports = router;
