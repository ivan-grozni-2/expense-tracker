const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", (req, res) => {

    const sql = "SELECT * FROM categories";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Err fetching : ", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

router.post("/", authMiddleware, (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
        return res.status(400).json({ error: "Name and type are required" });
    }

    db.query("SELECT * FROM categories WHERE name = ? AND type = ?", [name, type], (err, result) => {
        if (result.length === 0) {

            const sql = "INSERT INTO categories (name, type) VALUES (?, ?)";
            db.query(sql, [name, type], (err, result) => {
                if (err) {
                    console.error("Error adding into category:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                res.status(201).json({ message: "Category added", id: result.insertId })
            });
        } else {
            return res.status(201).json({ error: "This category and type already exists." })
        }
    });
});

module.exports = router;
