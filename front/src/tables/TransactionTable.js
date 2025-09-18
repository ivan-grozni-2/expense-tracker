import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./table.css"
import Filters from "../Filter/Filters";

function TransactionTable({ transactions, setTransactions, categories, fetchTransactions, filters, total, burgerClass, setTab, loading }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", category_id: "", date: "", note: "" });
  const [sorting, setSorting] = useState({ column: "", direction: 1 });
  const [arrowDirection, setArrowDirection] = useState({ id: "-", date: "-", amount: "-", category_name: "-", category_type: "-" })
  const { token } = useContext(AuthContext);
  const [note, setNote] = useState({ date: "", category_name: "", note: "", index: 0, id: 0 })
  const [message, setMessage] = useState("")
  const [noteButton, setNoteButton] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  let shrink = "transaction";

  if (burgerClass === "hamburger active") shrink = "transaction shrink";
  else shrink = "transaction";

  const startEditing = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      amount: transaction.amount,
      category_id: transaction.category_id ?? (categories[0]?.id || ""),
      date: transaction.date ? transaction.date.split("T")[0] : new Date().split("T")[0],
      note: transaction.note || "",
    });
  };
  function color(type) {
    if (type === "income") return "#4caf5055";
    else return "#f4433655";
  }

  const handleSave = (id) => {
    fetch(`${API_URL}/transactions/${id}`, {
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
      .then((data) => {
        setTransactions(transactions.map((t) => t.id === id ? { ...t, ...editForm, id } : t));
        setMessage(data.message);
        setEditingId(null);
      })
      .catch((err) => {
        console.error("Error updating transaction:", err)
        setMessage(err);
        if (err) {
          setMessage("Error updating transaction please try again");
          return;
        }
      })
    fetchTransactions(filters);
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
      .then((data) => {
        setTransactions(transactions.filter((t) => t.id !== id));
        setMessage(data.message);

      })
      .catch((err) => console.error("Error deleting transaction:", err))
    fetchTransactions(filters);
  };

  const handleSort = (key) => {
    const arrow = ["▼", "▲"];

    let dc = (Math.abs(sorting.direction - 1));

    setSorting({ column: key, direction: dc });
    setArrowDirection({ ...arrowDirection, id: "-", date: "-", amount: "-", category_name: "-", category_type: "-" });
    arrowDirection.amount = "-";
    arrowDirection.id = "-";
    arrowDirection.category_name = "-";
    arrowDirection.category_type = "-";
    arrowDirection.date = "-";
    setArrowDirection({ ...arrowDirection, [key]: arrow[sorting.direction] });

    setTransactions(transactions.sort((a, b) => {
      let ak = a[key];
      let bk = b[key];
      if (sorting.direction === 0) {
        if (key === "date") return new Date(bk) - new Date(ak);
        if (key === "category_name" || key === "categort_type") return bk.localeCompare(ak);

        return bk - ak;
      } else {
        if (key === "date") return new Date(ak) - new Date(bk);
        if (key === "category_name" || key === "category_type") return ak.localeCompare(bk);

        return ak - bk;
      }
    }));


  };

  function viewNote(id) {
    let n = "";
    setNote({});
    let name = "CATEGORY : " + transactions[id].category_name;
    let note = "" + transactions[id].note;
    setNote({ ...note, note: n });
    n = "DATE : " + transactions[id].date.split("T")[0];
    setNote({ ...note, date: n, category_name: name, note: note, index: id, id: transactions[id].id });
  }


  function handleExport() {
    let query = "";
    if (filters.startmonth || filters.category_id || filters.endmonth || filters.revenue) {
      const params = new URLSearchParams(filters).toString();
      query = "?" + params;

    }

    fetch(`${API_URL}/transactions/export/csv${query}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.csv";
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage("Sucessfully exported")
      })
      .catch(() => setMessage("error exporting"));

  };

  return (<div className={shrink} >
    <div className="transaction-tables-cards ">
      <Filters categories={categories} onFilter={fetchTransactions} fetchTransactions={fetchTransactions} vertical={true} />
    </div>
    <h2>Transaction table</h2>
    <div className="table dashboard-cards">
      {transactions.length ?
        (<div><table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>No.</th>
              <th onClick={() => handleSort("amount")}>Amount {arrowDirection.amount}</th>
              <th onClick={() => handleSort("category_name")}>Category {arrowDirection.category_name}</th>
              <th onClick={() => handleSort("date")}>Date {arrowDirection.date}</th>
              <th onClick={() => handleSort("category_type")}>revenue type {arrowDirection.category_type}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={t.id} onClick={() => { setNoteButton(false); viewNote(i) }} style={{ backgroundColor: color(t.category_type) }}>
                <td>{i + 1}</td>
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
                      className="input"
                      type="text"
                      onFocus={(e) => e.target.type = 'month'}
                      onBlur={(e) => e.target.type = 'text'}
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    />
                  ) : (t.date ? t.date.split("T")[0] : "")}
                </td>
                <td>
                  {editingId === t.id ? (t.category_type) : (t.category_type)}
                </td>
                <td style={{ display: "flex", gap: "10px" }}>
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
        </table></div>) : (
          <p> no transaction please add a new one
            <button type="click" onClick={() => setTab(3)} style={{ maxWidth: "15rem" }}>Add transaction</button></p>
        )}
      <div style={{ flex: "1", alignSelf: "flex-start", position: "sticky", top: "20px", margin: 10, textAlign: "center", width: "fit-content" }}>
        <p>{message}</p>
        {(loading && transactions.length!==0) ? (<div className="spinner-container">
                                <div className="spinner"></div>
                                <p>Please wait…</p>
                            </div>) : (<></>)}
        <h3>Total is {total}</h3>
        <button onClick={handleExport}>Export Spreadsheet</button>
        {note.note === "" ? (<p> Click on a transaction to view notes</p>) : (
          <div style={{ textAlign: "left" }}>
            <h4>{note.date}</h4>
            <h4>{note.category_name}</h4>{
              noteButton ? (<textarea
                className="input"
                style={{ width: "95%", minHeight: "4rem", height: "fit-content", resize: "none" }}
                placeholder={(note.note === "null") ? ("Please add notes") : (note.note)}
                value={editForm.note}
                type="text"
                onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
              />) : (
                <p style={{ padding: "30px" }}>{(note.note === "null") ? ("Please add notes") : (note.note)}</p>
              )}
            {
              noteButton ? (<>
                <button onClick={() => {
                  setNoteButton(false);
                  setNote({ ...note, note: editForm.note });
                  handleSave(note.id);

                }}>Save</button>
                <button onClick={() => setNoteButton(false)}>Cancel</button></>
              ) : (
                <button onClick={() => {
                  setNoteButton(true);
                  setEditingId(null);
                  setEditForm({
                    amount: transactions[note.index].amount,
                    category_id: transactions[note.index].category_id ?? (categories[0]?.id || ""),
                    date: transactions[note.index].date ? transactions[note.index].date.split("T")[0] : new Date().split("T")[0],
                    note: note.note || "",
                  });
                }}>Edit</button>
              )}

          </div>)}
      </div>
    </div>
  </div>
  );
}

export default TransactionTable;
