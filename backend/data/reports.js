const reports = [
  {
    id: "R001",
    name: "Weekly Service Report",
    type: "Service Summary",
    dateRange: "Last 7 Days",
    groupBy: "Day",
    generatedDate: "2026-08-29",
    totalVehicles: 24,
    completedVehicles: 18,
    pendingVehicles: 6,
    totalRevenue: 245000,
    averageServiceTime: 3.5
  },
  {
    id: "R002",
    name: "Monthly Vehicle Report",
    type: "Vehicle Report",
    dateRange: "This Month",
    groupBy: "Vehicle",
    generatedDate: "2026-08-29",
    totalVehicles: 86,
    completedVehicles: 72,
    pendingVehicles: 14,
    totalRevenue: 890000,
    averageServiceTime: 4.2
  },
  {
    id: "R003",
    name: "Mechanic Performance Report",
    type: "Mechanic Performance",
    dateRange: "This Month",
    groupBy: "Mechanic",
    generatedDate: "2026-08-29",
    totalVehicles: 86,
    completedVehicles: 72,
    pendingVehicles: 14,
    totalRevenue: 890000,
    averageServiceTime: 3.8
  }
];

module.exports = { reports };