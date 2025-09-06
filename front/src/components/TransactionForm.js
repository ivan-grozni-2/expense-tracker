import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

function TransactionForm({ transactions, setTransactions, categories, fetchTransactions }) {
  const { userid, token } = useContext(AuthContext);
  const [form, setForm] = useState({
    amount: "",
    category_id: categories[0]?.id || 1,
    date: new Date().toISOString().split("T")[0],
    userid: userid,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newTransaction) => {
        newTransaction.category_name = categories.find(item => item.id === newTransaction.category_id).name;
        console.log("new transaction is",newTransaction);
        setTransactions((prev) => [...prev, newTransaction]);
        setForm({
          amount: "",
          category_id: categories[0]?.id || "",
          date: new Date().toISOString().split("T")[0],
        });
      })
      .catch((err) => console.error("Error adding transaction:", err));

      //fetchTransactions();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <select name="category_id" value={form.category_id} onChange={handleChange}>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TransactionForm;
