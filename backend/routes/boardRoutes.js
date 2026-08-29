const express = require("express");

const {
  getBoard,
  addColumn,
  updateColumn,
  deleteColumn
} = require("../controllers/boardController");

const router = express.Router();

router.get("/:vehicleId", getBoard);

router.post("/:vehicleId/columns", addColumn);

router.put("/:vehicleId/columns/:columnId", updateColumn);

router.delete("/:vehicleId/columns/:columnId", deleteColumn);

module.exports = router;