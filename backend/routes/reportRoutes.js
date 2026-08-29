const express = require("express");

const {
  getReports,
  getReportById,
  createReport,
  deleteReport
} = require("../controllers/reportController");

const router = express.Router();

router.get("/", getReports);
router.get("/:id", getReportById);
router.post("/", createReport);
router.delete("/:id", deleteReport);

module.exports = router;