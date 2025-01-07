const express = require("express");
const { User } = require("./models");
const { comparePassword } = require("./helpers/bcrypt");
const { generateToken } = require("./helpers/jwt");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
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

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
