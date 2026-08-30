const { tasks } = require("../data/tasks");

let taskCounter = 2000;

const getTasksByVehicle = (req, res) => {
  const vehicleTasks = tasks.filter(
    (task) => task.vehicleId === req.params.vehicleId
  );

  res.json(vehicleTasks);
};

const addTask = (req, res) => {
  const { vehicleId, text, days, columnId } = req.body;

  if (!vehicleId || !text) {
    return res.status(400).json({
      message: "vehicleId and text are required"
    });
  }

  if (days !== undefined && (!Number.isInteger(days) || days < 1)) {
    return res.status(400).json({
      message: "days must be a positive integer"
    });
  }

  const newTask = {
    id: `task-${taskCounter++}`,
    vehicleId,
    text,
    days: days || 1,
    columnId: columnId || "tasklist"
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Task added successfully",
    task: newTask
  });
};

const updateTask = (req, res) => {
  const task = tasks.find(
    (t) => t.id === req.params.id
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const { text, days } = req.body;

  if (text !== undefined) {
    task.text = text;
  }

  if (days !== undefined) {
    task.days = days;
  }

  res.json({
    message: "Task updated successfully",
    task
  });
};

const deleteTask = (req, res) => {
  const index = tasks.findIndex(
    (t) => t.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(index, 1);

  res.json({
    message: "Task deleted successfully",
    task: deletedTask[0]
  });
};

const moveTask = (req, res) => {
  const task = tasks.find(
    (t) => t.id === req.params.id
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const { columnId } = req.body;

  if (!columnId) {
    return res.status(400).json({
      message: "columnId is required"
    });
  }

  task.columnId = columnId;

  res.json({
    message: "Task moved successfully",
    task
  });
};

module.exports = {
  getTasksByVehicle,
  addTask,
  updateTask,
  deleteTask,
  moveTask
};