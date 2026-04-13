const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) return res.send(err);
      res.send("User Registered");
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (result.length === 0) return res.send("User not found");

    const valid = await bcrypt.compare(password, result[0].password);

    if (!valid) return res.send("Wrong password");

    const token = jwt.sign({ id: result[0].id }, "secretkey");

    res.json({ token });
  });
});

// FORGOT PASSWORD
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const token = Math.random().toString(36).substring(2);

  db.query(
    "UPDATE users SET reset_token=? WHERE email=?",
    [token, email],
    (err) => {
      if (err) return res.send(err);
      res.send("Reset token generated");
    }
  );
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "UPDATE users SET password=? WHERE reset_token=?",
    [hash, token],
    (err) => {
      if (err) return res.send(err);
      res.send("Password updated");
    }
  );
});

// GET CURRENT USER
router.get("/me", (req, res) => {
  res.send("Protected user data");
});

module.exports = router;
