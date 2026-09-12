const Settings = require('../../database/models/Settings');

const DEFAULT_SETTINGS = {
  garageName: "AutoCare Garage",
  address: "123, Main Road, Colombo, Sri Lanka",
  phone: "+94 77 123 4567",
  currency: "LKR",
  dateFormat: "DD MMM YYYY",
  timeFormat: "12",
  timezone: "Colombo",
  language: "English",
  emailNotifications: true,
  autoBackup: true,
  lowStockAlert: true,
  jobCompletionAlert: true,
  darkMode: false,
  vehiclesPerPage: "10",
  defaultView: "Assigned Vehicles",
  compactSidebar: false,
};

const getOrCreateSettings = async (userId) => {
  let settings = await Settings.findOne({ owner: userId });

  if (!settings) {
    settings = await Settings.create({
      ...DEFAULT_SETTINGS,
      owner: userId,
    });
  }

  return settings;
};

const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings(req.user.id);
    res.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      message: "Failed to load settings.",
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings(req.user.id);

    Object.keys(req.body).forEach((key) => {
      if (key !== "owner" && key !== "_id") {
        settings[key] = req.body[key];
      }
    });

    await settings.save();

    res.json(settings);
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      message: "Failed to update settings.",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};