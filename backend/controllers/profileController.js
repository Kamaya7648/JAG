const { profile } = require("../data/profile");

const getProfile = (req, res) => {
  res.json(profile);
};

const updateProfile = (req, res) => {
  const { name, role, image } = req.body;

  if (name !== undefined) profile.name = name;
  if (role !== undefined) profile.role = role;
  if (image !== undefined) profile.image = image;

  res.json({
    message: "Profile updated successfully",
    profile
  });
};

module.exports = {
  getProfile,
  updateProfile
};
