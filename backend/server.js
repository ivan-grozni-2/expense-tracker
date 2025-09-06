const express = require("express");
const cors = require("cors");
const db = require("./db");
const categoriesRouter = require("./routes/categories");
const transactionsRouter = require("./routes/transactions");
const authRouter = require("./routes/auth");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/categories", categoriesRouter);
app.use("/transactions", transactionsRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("ET api running");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
