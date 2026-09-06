const Settings = require("../models/Settings");

// Single garage-wide settings document. Created with defaults on first read.
async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

async function getSettings(req, res) {
  try {
    const settings = await getOrCreateSettings();
    return res.status(200).json(settings);
  } catch (err) {
    console.error("Get settings error:", err);
    return res.status(500).json({ message: "Failed to fetch settings." });
  }
}

async function updateSettings(req, res) {
  try {
    const settings = await getOrCreateSettings();

    Object.assign(settings, req.body);
    await settings.save();

    return res.status(200).json(settings);
  } catch (err) {
    console.error("Update settings error:", err);
    return res.status(500).json({ message: "Failed to update settings." });
  }
}

module.exports = { getSettings, updateSettings };
