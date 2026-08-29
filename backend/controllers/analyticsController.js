const { vehicles } = require("../data/vehicles");

const getAnalytics = (req, res) => {
  const vehiclesToday = vehicles.filter(
    (v) => v.status === "today"
  ).length;

  const inRepair = vehicles.filter(
    (v) => v.status === "Repairing"
  ).length;

  const completed = vehicles.filter(
    (v) => v.status === "Completed"
  ).length;

  const monthlyRevenue = vehicles
    .filter((v) => v.status === "Completed")
    .reduce((sum, v) => sum + (v.revenue || 0), 0);

  res.json({
    vehiclesToday,
    inRepair,
    completed,
    monthlyRevenue,
    yesterday: {
      vehiclesToday: 0,
      inRepair: 0,
      completed: 0
    },
    lastMonthRevenue: 0
  });
};

module.exports = {
  getAnalytics
};