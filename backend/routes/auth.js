const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", (req, res) => {
    const { username, password, email } = req.body;
    let canRegister = false;

    db.query(`SELECT * FROM users WHERE name = ? OR email = ?`, [username, email], async (err, result) => {
        if (err) {
            console.error("Error in the server:", err);
            return res.status(500).json({ error: "Cannot connect to database" });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: "user exists" });
        }
        canRegister = true;

        if (canRegister) {
            const hashpswrd = await bcrypt.hash(password, 10);

            db.query("INSERT INTO users (name, password, email) VALUES (?,?,?)", [username, hashpswrd, email], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Failed to register" });
                }
            });
            res.json({ message: "Welcome to the expense-tracker " + username });

        } else {
            return res.json({ error: "Error registering please try again" })
        }
    });

});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log("heyyyyyyyyyyyy");

    db.query("SELECT * FROM users WHERE name = ?", [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Cannot connect to database" });
        }

        if (result.length === 0) {
            return res.status(500).json({ error: "Invalid Username or Password" });

        }

        try {

            const match = await bcrypt.compare(password, result[0].password);

            let id = 0;
            if (!match) {
                return res.status(400).json({ error: "Invalid Username or Password" });

            }

            
                id = result[0].id;
            
            const token = jwt.sign({ id: result[0].id, username: result[0].name }, JWT_SECRET, { expiresIn: "1h" });

            res.json({ token, id });
        } catch (err) {
            console.error(err);

            res.json({ error: "Failed login" })
        }


    });

});


module.exports = router;
