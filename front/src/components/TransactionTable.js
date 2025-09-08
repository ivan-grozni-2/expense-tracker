import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

function TransactionTable({ transactions, setTransactions, categories, fetchTransactions, filters, total }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", category_id: "", date: "" });
  const [sorting, setSorting] = useState({ column: "", direction: 1 });
  const [arrowDirection, setArrowDirection] = useState({ id: "-", date: "-", amount: "-", category_name: "-", category_type:"-" })
  const { user, token, userid } = useContext(AuthContext);
  const [note, setNote] = useState({})

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
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
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
      fetchTransactions(filters);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/transactions/${id}`, { 
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }, })
      .then(() => setTransactions(transactions.filter((t) => t.id !== id)))
      .catch((err) => console.error("Error deleting transaction:", err));
      fetchTransactions(filters);
  };

  const handleSort = (key) => {
    const arrow = ["v", "^"];

    let dc = (Math.abs(sorting.direction - 1));

    setSorting({ column: key, direction: dc });
    setArrowDirection( {...arrowDirection, id: "-", date: "-", amount: "-", category_name: "-", category_type: "-" });
    arrowDirection.amount = "-";
    arrowDirection.id = "-";
    arrowDirection.category_name = "-";
    arrowDirection.category_type = "-";
    arrowDirection.date = "-";
    console.log("ARROWS ", arrowDirection)
    setArrowDirection({ ...arrowDirection, [key]: arrow[sorting.direction] });

    setTransactions(transactions.sort((a, b) => {
      let ak = a[key];
      let bk = b[key];
      if (sorting.direction === 0) {
        if (key === "date") return new Date(bk) - new Date(ak);
        if (key === "category_name"|| key ==="categort_type") return bk.localeCompare(ak);

        return bk - ak;
      } else {
        if (key === "date") return new Date(ak) - new Date(bk);
        if (key === "category_name"|| key ==="category_type") return ak.localeCompare(bk);

        return ak - bk;
      }
    }));


    console.log("dn : ", key);
    console.log("column : ", sorting);
    console.log("dc : ", dc);
  };

  function viewNote(id){
    let n = "";
    setNote({});
    let name = "CATEGORY : " + transactions[id].category_name;
    let note = "" + transactions[id].note;
    setNote({...note, note:n});
    n = "DATE : " + transactions[id].date.split("T")[0];
    setNote({...note, date:n, category_name:name, note :note});
  }

  

  return (<><div style = {{display: "flex"}} >{transactions.length ?
    (<table border="1" cellPadding="5">
      <thead>
        <tr>
          <th onClick={() => handleSort("id")}>ID {arrowDirection.id}</th>
          <th onClick={() => handleSort("amount")}>Amount {arrowDirection.amount}</th>
          <th onClick={() => handleSort("category_name")}>Category {arrowDirection.category_name}</th>
          <th onClick={() => handleSort("date")}>Date {arrowDirection.date}</th>
          <th onClick={() => handleSort("category_type")}>revenue type {arrowDirection.category_type}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t, i) => (
          <tr key={t.id} onClick={() => viewNote(i)}>
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
                  onChange={(e) => setEditForm({ ...editForm, category_id: Number(e.target.value) })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              ) : t.category_name}
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
              {editingId === t.id ? (t.category_type):(t.category_type)}
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
    </table>) : (
      <p> no transaction please add a new one</p>
    )}
    <div style={{alignSelf: "flex-start", position: "-webkit-sticky", position:"sticky", top : "-20px",  margin : 10, textAlign: "center", width : "50%"}}>
      <h3>Total is {total}</h3>
      <div style = {{textAlign: "left"}}>
      <h4>{note.date}</h4>
      <h4>{note.category_name}</h4>
      <p>{note.note}</p>
      </div>
    </div>
    </div>
    </>
  );
}

export default TransactionTable;
