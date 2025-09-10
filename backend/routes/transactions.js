const express = require("express");
const router = express.Router();
const db = require("../db");
const { Parser } = require("json2csv");
const authMiddleware = require("../middleware/auth");

router.get("/export/csv", authMiddleware, (req, res) => {
  let sql = `SELECT t.amount, DATE_FORMAT(t.date, '%Y-%m') AS date, c.name AS category
              FROM transactions t
              LEFT JOIN categories c ON t.category_id = c.id
              WHERE user_id = ?
              `;
  const { startmonth, endmonth, category_id } = req.query;
  const params = [];
  const user = req.user.id;
  params.push(user);

  if (startmonth && endmonth) {
    sql += " AND DATE_FORMAT(t.date, '%Y-%m') BETWEEN ? AND ? ";
    params.push(startmonth, endmonth);
  }

  if (category_id) {
    sql += " AND category_id = ?";
    params.push(category_id);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("error getting for export :", err);
      return res.status(500).json({ error: err.message });
    }

    try {
      const json2csv = new Parser();
      const csv = json2csv.parse(result);

      res.header("Content-Type", "text/csv");
      res.attachment("transactions.csv");
      res.send(csv);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

  });


});

router.get("/user", authMiddleware, (req,res) => {

console.log(req.user);
  const user = req.user.username;
  res.json(user);
});

router.get("/", authMiddleware, (req, res) => {

  const { startmonth, endmonth, category_id, revenue } = req.query;
  const params = [];
  const user = req.user.id;
  params.push(user);

  
  let sql = "SELECT t.*, c.name AS category_name, c.type AS category_type FROM transactions t LEFT JOIN categories c ON t.category_id = c.id ";

    const conditions = [];
    conditions.push("WHERE t.user_id = ?");

  if ((startmonth && endmonth) || category_id || revenue) {

    if (startmonth && endmonth) {
      conditions.push(" DATE_FORMAT(t.date, '%Y-%m') BETWEEN ? AND ? ");
      params.push(startmonth, endmonth);
    }
    if (category_id) {
      conditions.push("t.category_id = ?");
      params.push(category_id);
    }
    if(revenue) {
      conditions.push(" c.type = ? ");
      params.push(revenue);
    }

  }
    sql += " " + conditions.join(" AND ");
    sql += " ORDER BY t.id ASC"

  db.query(sql, params, (err, result) => {


    if (err) {
      console.error("error getting transaction :", err);
      return res.status(500).json({ error: "transaction error" });
    }
    res.json(result);
  });

});


router.get("/all", authMiddleware, (req, res) => {

  const user = req.user.id;
  
  let sql = "SELECT t.*, c.name AS category_name, c.type AS category_type FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = ? ";


  db.query(sql, user, (err, result) => {


    if (err) {
      console.error("error getting transaction :", err);
      return res.status(500).json({ error: "transaction error" });
    }
    res.json(result);
  });

});

router.get("/total", authMiddleware, (req, res) => {
  let sql = "SELECT SUM(IF(c.type = 'income', t.amount, -t.amount)) as total FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = ? "
  const { startmonth, endmonth, category_id, revenue } = req.query;
  const params = [];
  const user = req.user.id;
  params.push(user);

  if (startmonth && endmonth) {
    sql += " AND DATE_FORMAT(t.date, '%Y-%m') BETWEEN ? AND ? ";
    params.push(startmonth, endmonth);
  }
  if (category_id) {
    sql += " AND category_id = ?";
    params.push(category_id);
  }
  if(revenue) {
    sql += " AND c.type = ? ";
    params.push(revenue);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("total error:", err);
      return res.status(500).json({ error: "cannot get total" });
    }
    res.json({ total: result[0].total || 0 });
  });


});

router.get("/summary", authMiddleware, (req, res) => {
  let sql = `
    SELECT c.name AS category, c.type AS category_type, SUM(if(c.type = 'income', t.amount, -t.amount)) + 0 AS total
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? 
  `;

  const { startmonth, endmonth, revenue } = req.query;
  const params = [];
  const user = req.user.id;
  params.push(user);

  if (startmonth && endmonth) {
    sql += " AND DATE_FORMAT(t.date, '%Y-%m') BETWEEN ? AND ? ";
    params.push(startmonth, endmonth);
  }
  if(revenue) {
    sql += " AND c.type = ? ";
    params.push(revenue);
  }

  sql += "GROUP BY c.name, c.type";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Error fetching summary:", err);
      return res.status(500).json({ error: "Failed to fetch summary" });
    }
    res.json(rows);
  });
});

router.get("/summary/monthly", authMiddleware, (req, res) => {
  let sql = `
    SELECT DATE_FORMAT(t.date, '%Y-%m-%d') AS day, SUM(if(c.type = 'income', t.amount, -t.amount)) AS total
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE user_id = ?
    `
  const backsql = `
    GROUP BY day
    ORDER BY day
  `;
  const { startmonth, endmonth, category_id, revenue } = req.query;
  const params = [];
  const user = req.user.id;
  params.push(user);

  if (category_id) {
    sql += " AND category_id = ? ";
    params.push(category_id);
  }
  if (startmonth && endmonth) {
    sql += " AND DATE_FORMAT(date, '%Y-%m') BETWEEN ? AND ? ";
    params.push(startmonth, endmonth);
  }
  if(revenue) {
    sql += " AND c.type = ? ";
    params.push(revenue);
  }

  sql += backsql;

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error summurizing:", err);
      return res.status(500).json({ error: "failed to fetch monthly summary" });
    }
    res.json(result);
  });
});

router.get("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const user = req.user.id;
  db.query("SELECT * FROM transactions WHERE id = ? AND user_id = ? ", [id, user], (err, results) => {
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

router.post("/", authMiddleware, (req, res) => {
  const { amount, category_id, date } = req.body;
  const user = req.user.id;

  db.query(
    "INSERT INTO transactions (user_id, amount, category_id, date) VALUES (?, ?, ?, ?)",
    [user, amount, category_id || null, date],
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

router.put("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { amount, category_id, date } = req.body;
  const user = req.user.id;

  db.query(
    "UPDATE transactions SET amount = ?, category_id = ?, date = ? WHERE id = ? AND user_id = ?",
    [amount, category_id || null, date, id, user],
    (err, result) => {
      if (err) {
        console.error("Error updating transaction:", err);
        return res.status(500).json({ error: "Failed to update transaction" });
      }
      res.json({ message: "Transaction updated successfully" });
    }
  );
});

router.delete("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const user = req.user.id;

  db.query("DELETE FROM transactions WHERE id = ? AND user_id = ?", [id, user], (err, result) => {
    if (err) {
      console.error("Error deleting transaction:", err);
      return res.status(500).json({ error: "Failed to delete transaction" });
    }
    res.json({ message: "Transaction deleted successfully" });
  });
});

module.exports = router;
