import React, { useState } from "react";

function TransactionTable({ transactions, setTransactions, categories }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", category_id: "", date: "" });

  const startEditing = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      amount: transaction.amount,
      category_id: transaction.category_id ?? (categories[0]?.id || ""),
      date: transaction.date ? transaction.date.split("T")[0] : new Date().toISOString().split("T")[0],
    });
  };

  const handleSave = (id) => {
    fetch(`http://localhost:5000/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      })
      .then(() => {
        setTransactions(transactions.map((t) => t.id === id ? { ...t, ...editForm, id } : t));
        setEditingId(null);
      })
      .catch((err) => console.error("Error updating transaction:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/transactions/${id}`, { method: "DELETE" })
      .then(() => setTransactions(transactions.filter((t) => t.id !== id)))
      .catch((err) => console.error("Error deleting transaction:", err));
  };

  return (
    <table border="1" cellPadding="5">
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>
              {editingId === t.id ? (
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                />
              ) : t.amount}
            </td>
            <td>
              {editingId === t.id ? (
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              ) : (
                categories.find((c) => c.id === t.category_id)?.name || "Uncategorized"
              )}
            </td>
            <td>
              {editingId === t.id ? (
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              ) : (t.date ? t.date.split("T")[0] : "")}
            </td>
            <td>
              {editingId === t.id ? (
                <>
                  <button onClick={() => handleSave(t.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEditing(t)}>Edit</button>
                  <button onClick={() => handleDelete(t.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;
