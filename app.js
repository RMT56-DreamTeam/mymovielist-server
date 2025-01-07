const express = require("express");
const { User } = require("./models");
const { comparePassword } = require("./helpers/bcrypt");
const { generateToken } = require("./helpers/jwt");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });

    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already exists" });
    } else if (error.name === "SequelizeValidationError") {
      const message = error.errors.map((err) => err.message);
      return res.status(400).json({ message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValidPassword = comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const access_token = generateToken({ id: user.id, email: user.email });
    res.status(200).json({ message: "Login success", access_token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/movies');
app.get('/movies/:id');
app.post('/movies');
app.put('/movies/:id');
app.delete('/movies/:id');

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
