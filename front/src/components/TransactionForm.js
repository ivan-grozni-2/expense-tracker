import React, { useState } from "react";

function TransactionForm({ setTransactions, categories }) {
  const [form, setForm] = useState({
    amount: "",
    category_id: categories[0]?.id || "",
    date: new Date().toISOString().split("T")[0], 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newTransaction) => {
        setTransactions((prev) => [...prev, newTransaction]);
        setForm({
          amount: "",
          category_id: categories[0]?.id || "",
          date: new Date().toISOString().split("T")[0],
        });
      })
      .catch((err) => console.error("Error adding transaction:", err));
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
