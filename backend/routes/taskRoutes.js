const express = require("express");

const {
  getTasksByVehicle,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/:vehicleId", getTasksByVehicle);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id/move", moveTask);
router.delete("/:id", deleteTask);

module.exports = router;