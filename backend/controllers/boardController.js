const { getOrCreateBoard } = require("../data/boards");

const getBoard = (req, res) => {
  const { vehicleId } = req.params;

  const board = getOrCreateBoard(vehicleId);

  res.json(board);
};

const addColumn = (req, res) => {
  const { vehicleId } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Column title is required"
    });
  }

  const board = getOrCreateBoard(vehicleId);

  const newColumn = {
    id: `col-${vehicleId}-${Date.now()}`,
    title,
    cards: []
  };

  board.columns.push(newColumn);

  res.status(201).json({
    message: "Column added successfully",
    column: newColumn
  });
};

const updateColumn = (req, res) => {
  const { vehicleId, columnId } = req.params;
  const { title } = req.body;

  const board = getOrCreateBoard(vehicleId);

  const column = board.columns.find((col) => col.id === columnId);

  if (!column) {
    return res.status(404).json({
      message: "Column not found"
    });
  }

  if (!title) {
    return res.status(400).json({
      message: "Column title is required"
    });
  }

  column.title = title;

  res.json({
    message: "Column updated successfully",
    column
  });
};

const deleteColumn = (req, res) => {
  const { vehicleId, columnId } = req.params;

  const board = getOrCreateBoard(vehicleId);

  const columnIndex = board.columns.findIndex(
    (col) => col.id === columnId
  );

  if (columnIndex === -1) {
    return res.status(404).json({
      message: "Column not found"
    });
  }

  const deletedColumn = board.columns.splice(columnIndex, 1);

  res.json({
    message: "Column deleted successfully",
    column: deletedColumn[0]
  });
};

module.exports = {
  getBoard,
  addColumn,
  updateColumn,
  deleteColumn
};