const User = require("../../database/models/User");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

async function register(req, res) {
  try {
    const {
      name,
      employeeId,
      phone,
      email,
      department,
      experience,
      password,
      profilePhoto,
    } = req.body;

    if (!name || !employeeId || !phone || !email || !department || !password) {
      return res.status(400).json({
        message:
          "Name, employee ID, phone, email, department, and password are required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanEmployeeId = employeeId.trim().toUpperCase();

    const existingEmail = await User.findOne({ email: cleanEmail });

    if (existingEmail) {
      return res.status(409).json({
        message: "An account with that email already exists.",
      });
    }

    const existingEmployee = await User.findOne({
      employeeId: cleanEmployeeId,
    });

    if (existingEmployee) {
      return res.status(409).json({
        message: "An account with that Employee ID already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      employeeId: cleanEmployeeId,
      phone: phone.trim(),
      email: cleanEmail,
      department: department.trim(),
      experience: experience || "",
      password,
      profilePhoto: profilePhoto || "",
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "Registration successful.",
      user,
      token,
    });
  } catch (err) {
    console.error("Register error:", err);

    return res.status(500).json({
      message: "Registration failed.",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("LOGIN:", email, password);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful.",
      user,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Login failed.",
    });
  }
}

module.exports = {
  register,
  login,
};