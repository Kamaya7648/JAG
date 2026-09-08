const User = require('../../database/models/User')

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });

    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({ user });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed." });
  }
}

module.exports = { register, login };
