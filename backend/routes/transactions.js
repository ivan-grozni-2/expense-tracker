const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {

    const sql = `
    SELECT t.id, t.amount, t.date, t.note, c.id AS category, c.type AS category_type, t.user_id
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Err fetching : ", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

router.post("/", (req, res) => {
    const { user_id, category_id, amount, date, note } = req.body;

    if (!user_id || !category_id || !amount || !date || !note) {
        return res.status(400).json({ error: "Fill the form please" });
    }

    const sql = "INSERT INTO transactions (user_id, category_id, amount, date, note) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [user_id, category_id, amount, date, note], (err, result) => {
        if (err) {
            console.error("Error adding into catagory:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Catagory added", id: result.insertId })
    });

});

router.get("/stats/category", (req,res) =>{
const sql = `SELECT c.name AS category, c.type AS category_type, SUM(t.amount) AS total 
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            GROUP BY c.id
            `;

            db.query(sql, (err, result) => {
                if(err){
                    console.error("Error fetching : ", err);
                    return res.status(500).json({error:"Database error"});
                }
                res.json(result);
            });
});

router.get("/stats/monthly", (req,res) => {
    const sql = `
    SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total
    FROM transactions
    GROUP BY month
    ORDER BY month
    `;

    db.query(sql, (err, result) =>{
        if(err){
            console.error("Error fetching : ", err);
            return res.status(500).json({error:"Database error"});
        }
        res.json(result);
    });
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    console.log("DELETE id:", id);

    db.query("DELETE FROM transactions WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Error adding into catagory:", err);
            return res.status(500).json({ error: "Failed to delete" });
        }
        res.status(201).json({ message: "Transaction deleted"})
    });

});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category_id, date, note } = req.body;
  
    console.log(amount + " is the amount");

    const sql = `UPDATE transactions SET amount = ?, category_id = ?, date = ?, note = ? WHERE id = ?`

    db.query(sql, [ amount, category_id, date, note, id], (err, result) => {

        if(err){
            console.error("Error editing:", err);
            return res.status(500).json({error: "Failed to edit"});
        }
        res.json({message: "Update successful"});
    })
});


module.exports = router;