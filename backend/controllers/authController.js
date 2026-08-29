const { users } = require("../data/users");

let userCounter = 2;

const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  const existingUser = users.find(
    (user) => user.email === email
  );

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  const newUser = {
    id: `U00${userCounter++}`,
    name,
    email,
    password,
    role: "Garage Supervisor"
  };

  users.push(newUser);

  res.status(201).json({
    message: "Registration successful",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const user = users.find(
    (user) =>
      user.email === email &&
      user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

const getProfile = (req, res) => {
  const user = users[0];

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

module.exports = {
  register,
  login,
  getProfile
};