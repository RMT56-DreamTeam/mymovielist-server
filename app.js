const express = require("express");
const { User } = require("./models");

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

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
