const Task = require("../models/Task");
const Vehicle = require("../models/Vehicle");

async function getTasksByVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findOne({
      id: req.params.vehicleId,
      owner: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const tasks = await Task.find({
      vehicleId: req.params.vehicleId,
      owner: req.user.id,
    }).sort({ createdAt: 1 });

    return res.status(200).json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    return res.status(500).json({
      message: "Failed to fetch tasks.",
    });
  }
}

async function createTask(req, res) {
  try {
    const { vehicleId, text, days, columnId } = req.body;

    if (!vehicleId || !text || !columnId) {
      return res.status(400).json({
        message: "vehicleId, text, and columnId are required.",
      });
    }

    const vehicle = await Vehicle.findOne({
      id: vehicleId,
      owner: req.user.id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found.",
      });
    }

    const task = await Task.create({
      vehicleId,
      owner: req.user.id,
      text,
      days: days || 1,
      columnId,
    });

    return res.status(201).json({ task });
  } catch (err) {
    console.error("Create task error:", err);
    return res.status(500).json({
      message: "Failed to add task.",
    });
  }
}

async function updateTask(req, res) {
  try {
    const { text, days } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      {
        ...(text !== undefined && { text }),
        ...(days !== undefined && { days }),
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({ task });
  } catch (err) {
    console.error("Update task error:", err);
    return res.status(500).json({
      message: "Failed to update task.",
    });
  }
}

async function moveTask(req, res) {
  try {
    const { columnId } = req.body;

    if (!columnId) {
      return res.status(400).json({
        message: "columnId is required.",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      { columnId },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({ task });
  } catch (err) {
    console.error("Move task error:", err);
    return res.status(500).json({
      message: "Failed to move task.",
    });
  }
}

async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted",
    });
  } catch (err) {
    console.error("Delete task error:", err);
    return res.status(500).json({
      message: "Failed to delete task.",
    });
  }
}

module.exports = {
  getTasksByVehicle,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
};