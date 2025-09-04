const express = require("express");
const router = express.Router();
const db = require("../db");
const {Parser} = require("json2csv")

router.get("/export/csv", (req, res) => {
  let sql = `SELECT t.amount, DATE_FORMAT(t.date, '%Y-%m') AS date, c.name AS category
              FROM transactions t
              LEFT JOIN categories c ON t.category_id = c.id
              WHERE 1=1
              `;
  const {month, category_id} = req.query;
  const params = [];

  if(month){
    sql += " AND DATE_FORMAT(t.date, '%Y-%m') = ?";
    params.push(month);
  }

  if(category_id){
    sql += " AND category_id = ?";
    params.push(category_id);
  }
 
  console.log("sql:", sql);
  console.log("params:", params);

  db.query(sql, params, (err, result) => {
    if(err){
      console.error("error getting for export :", err);
      return res.status(500).json({error : err.message});
    }

  console.log("sql:", result);

    try{
      const json2csv = new Parser();
      const csv = json2csv.parse(result);

      res.header("Content-Type", "text/csv");
      res.attachment("transactions.csv");
      res.send(csv);
    }catch(err){
      res.status(500).json({error: err.message});
    }

  });


});

router.get("/", (req, res) => {

  const { month, category_id } = req.query;
  const params = [];

  let sql = "SELECT * FROM transactions ";

  if (month || category_id) {
    sql += "WHERE";
    const conditions = [];

    if (month) {
      conditions.push("DATE_FORMAT(date, '%Y-%m') = ?");
      params.push(month);
    }
    if (category_id) {
      conditions.push("category_id = ?");
      params.push(category_id);
    }

    sql += " " + conditions.join(" AND ");
  }
  
  db.query(sql, params, (err, result) => {
    
    if (err) {
      console.error("error getting transaction :", err);
      return res.status(500).json({ error: "transaction error" });
    }
    res.json(result);
  });

});

router.get("/total", (req,res) => {
  let sql = "SELECT SUM(t.amount) as total FROM transactions t WHERE 1=1"
  const {month, category_id} = req.query;
  const params = [];

  if(month){
    sql += " AND DATE_FORMAT(date, '%Y-%m') = ?";
    params.push(month);
  }
  if(category_id){
    sql += " AND category_id = ?";
    params.push(category_id);
  }

  db.query(sql, params, (err, result) => {
    if(err){
      console.error("total error:", err);
      return res.status(500).json({error:"cannot get total"});
    }
    res.json({total: result[0].total || 0});
  });


});

router.get("/summary", (req, res) => {
  let sql = `
    SELECT c.name AS category, SUM(t.amount) + 0 AS total
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
  `;

  const { month } = req.query;
  const params = [];

  if (month) {
    sql += " WHERE DATE_FORMAT(t.date, '%Y-%m') = ? "
    params.push(month);

  }

  sql += "GROUP BY c.name";

  console.log("sql summary: ", sql);


  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Error fetching summary:", err);
      return res.status(500).json({ error: "Failed to fetch summary" });
    }
    res.json(rows);
  });
});

router.get("/summary/monthly", (req, res) => {
  let sql = `
    SELECT DATE_FORMAT(date, '%Y-%M') AS month, SUM(amount) AS total, MIN(date) as first_day
    FROM transactions`
  const backsql = `
    GROUP BY month
    ORDER BY first_day
  `;
  const {category_id} = req.query;
  const params =[];

  if(category_id){
    sql += " WHERE category_id = ? ";
    params.push(category_id);
  }

  sql += backsql;

  console.log("summary monthly sql: ", sql);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error summurizing:", err);
      return res.status(500).json({ error: "failed to fetch monthly summary" });
    }
    res.json(result.map(({ month, total }) => ({ month, total })));
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM transactions WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching transaction:", err);
      return res.status(500).json({ error: "Failed to fetch transaction" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(results[0]);
  });
});

router.post("/", (req, res) => {
  const { amount, category_id, date } = req.body;

  db.query(
    "INSERT INTO transactions (amount, category_id, date) VALUES (?, ?, ?)",
    [amount, category_id || null, date],
    (err, result) => {
      if (err) {
        console.error("Error creating transaction:", err);
        return res.status(500).json({ error: "Failed to create transaction" });
      }
      db.query("SELECT * FROM transactions WHERE id = ?", [result.insertId], (err2, rows) => {
        if (err2) {
          console.error("Error fetching new transaction:", err2);
          return res.status(500).json({ error: "Failed to fetch new transaction" });
        }
        res.json(rows[0]);
      });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { amount, category_id, date } = req.body;

  db.query(
    "UPDATE transactions SET amount = ?, category_id = ?, date = ? WHERE id = ?",
    [amount, category_id || null, date, id],
    (err, result) => {
      if (err) {
        console.error("Error updating transaction:", err);
        return res.status(500).json({ error: "Failed to update transaction" });
      }
      res.json({ message: "Transaction updated successfully" });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM transactions WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting transaction:", err);
      return res.status(500).json({ error: "Failed to delete transaction" });
    }
    res.json({ message: "Transaction deleted successfully" });
  });
});

module.exports = router;
