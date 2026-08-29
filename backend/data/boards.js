const boards = {};

const stages = [
  "Received",
  "Diagnosis",
  "Repairing",
  "Quality Check",
  "Completed"
];

const defaultTasks = {
  Received: [
    { text: "Log vehicle intake details", days: 1 }
  ],
  Diagnosis: [
    { text: "Run full diagnostic scan", days: 1 }
  ],
  Repairing: [
    { text: "Order replacement parts", days: 2 },
    { text: "Carry out repair work", days: 3 }
  ],
  "Quality Check": [
    { text: "Test drive and inspection", days: 1 }
  ],
  Completed: [
    { text: "Generate invoice and notify customer", days: 1 }
  ]
};

let taskCounter = 1000;
let columnCounter = 1000;

function createTask(text, days) {
  return {
    id: `task-${taskCounter++}`,
    text,
    days
  };
}

function createBoard(vehicleId, vehicleStatus) {
  return {
    vehicleId,
    taskList: [],
    columns: stages.map((stage) => ({
      id: `col-${vehicleId}-${stage.replace(/\s+/g, "").toLowerCase()}`,
      title: stage,
      cards:
        stage === vehicleStatus
          ? defaultTasks[stage].map((task) =>
              createTask(task.text, task.days)
            )
          : []
    }))
  };
}

function getOrCreateBoard(vehicleId, vehicleStatus = "Received") {
  if (!boards[vehicleId]) {
    boards[vehicleId] = createBoard(vehicleId, vehicleStatus);
  }

  return boards[vehicleId];
}

module.exports = {
  boards,
  getOrCreateBoard,
  createTask,
  columnCounter
};