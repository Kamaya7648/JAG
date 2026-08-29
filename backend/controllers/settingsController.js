const { settings } = require("../data/settings");

const getSettings = (req, res) => {
  res.json(settings);
};

const updateSettings = (req, res) => {
  Object.assign(settings, req.body);

  res.json({
    message: "Settings updated successfully",
    settings
  });
};

module.exports = {
  getSettings,
  updateSettings
};