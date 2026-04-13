const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL ITEMS
router.get("/", (req, res) => {
  db.query("SELECT * FROM items", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// GET SINGLE ITEM
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM items WHERE id=?", [id], (err, result) => {
    if (err) return res.send(err);
    res.json(result[0]);
  });
});

// CREATE ITEM
router.post("/", (req, res) => {
  const { user_id, title, description } = req.body;

  db.query(
    "INSERT INTO items (user_id,title,description) VALUES (?,?,?)",
    [user_id, title, description],
    (err) => {
      if (err) return res.send(err);
      res.send("Item created");
    }
  );
});

// UPDATE ITEM
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  db.query(
    "UPDATE items SET title=?, description=?, status=? WHERE id=?",
    [title, description, status, id],
    (err) => {
      if (err) return res.send(err);
      res.send("Item updated");
    }
  );
});

// DELETE ITEM
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM items WHERE id=?", [id], (err) => {
    if (err) return res.send(err);
    res.send("Item deleted");
  });
});

// STATS API
router.get("/stats/all", (req, res) => {
  db.query(
    "SELECT status, COUNT(*) as count FROM items GROUP BY status",
    (err, result) => {
      if (err) return res.send(err);
      res.json(result);
    }
  );
});

module.exports = router;
