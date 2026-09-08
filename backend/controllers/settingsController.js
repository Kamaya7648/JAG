const Settings = require('../../database/models/Settings');

// Get the single garage settings document.
// If it does not exist yet, create it with the default values.
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return settings;
};

const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.status(200).json(settings);
  } catch (err) {
    console.error("Get settings error:", err);

    res.status(500).json({
      message: "Failed to fetch settings."
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    Object.assign(settings, req.body);

    await settings.save();

    res.status(200).json({
      message: "Settings updated successfully",
      settings
    });
  } catch (err) {
    console.error("Update settings error:", err);

    res.status(500).json({
      message: "Failed to update settings."
    });
  }
};

module.exports = {
  getSettings,
  updateSettings
};