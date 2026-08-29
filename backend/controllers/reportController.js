const { reports } = require("../data/reports");

let reportCounter = 4;

const getReports = (req, res) => {
  res.json(reports);
};

const getReportById = (req, res) => {
  const report = reports.find((r) => r.id === req.params.id);

  if (!report) {
    return res.status(404).json({
      message: "Report not found"
    });
  }

  res.json(report);
};

const createReport = (req, res) => {
  const {
    name,
    type,
    dateRange,
    groupBy
  } = req.body;

  if (!name || !type || !dateRange) {
    return res.status(400).json({
      message: "name, type and dateRange are required"
    });
  }

  const newReport = {
    id: `R00${reportCounter++}`,
    name,
    type,
    dateRange,
    groupBy: groupBy || "None",
    generatedDate: new Date().toISOString().split("T")[0],
    totalVehicles: 0,
    completedVehicles: 0,
    pendingVehicles: 0,
    totalRevenue: 0,
    averageServiceTime: 0
  };

  reports.push(newReport);

  res.status(201).json({
    message: "Report generated successfully",
    report: newReport
  });
};

const deleteReport = (req, res) => {
  const index = reports.findIndex((r) => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: "Report not found"
    });
  }

  const deletedReport = reports.splice(index, 1);

  res.json({
    message: "Report deleted successfully",
    report: deletedReport[0]
  });
};

module.exports = {
  getReports,
  getReportById,
  createReport,
  deleteReport
};