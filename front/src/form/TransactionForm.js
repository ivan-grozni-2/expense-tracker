import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import "./form.css"

function TransactionForm({ categories, fetchTransactions, filters, burgerClass, fetchSummary, fetchmonthly, loading }) {
  const { userid, token } = useContext(AuthContext);
  const [form, setForm] = useState({
    amount: "",
    category_id: categories[0]?.id || 1,
    date: new Date().toISOString().split("T")[0],
    userid: userid,
    note: "",
  });
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [transMessage, setTransMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;





  function handleAdd(e) {
    e.preventDefault();

    if (name && type) {
      fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name, type: type })

      }).then((res) => res.json())
        .then((data) => {
          if (data.error) setMessage(data.error);
          else {
            setMessage(data.message + ". Category is " + name)
            setName("")
            setType("")
          };
        })
        .catch((err) => {
          setMessage(err);
          console.error(err)
        });
      fetchTransactions(filters);
      fetchSummary(filters);
      fetchmonthly(filters);

    } else {
      setMessage("Please fill every form")
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/transactions`, {
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
        console.log("new transaction is", newTransaction);
        setForm({
          amount: "",
          category_id: categories[0]?.id || "",
          date: new Date().toISOString().split("T")[0],
          note:""
        });
        setTransMessage("Transaction added")
      })
      .catch((err) => setTransMessage(err));
      fetchTransactions(filters);
      fetchSummary(filters);
      fetchmonthly(filters);
  };

  let shrink = "";
  if (burgerClass === "hamburger active") shrink = "edit shrink";
  else shrink = "edit";

  return (<div className={shrink}>
    <div className="page">
      <h2>Add Transaction</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="form">
        <input
          className="input"
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <select className="input" name="category_id" value={form.category_id} onChange={handleChange}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          className="input"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <textarea
          id="note"
          className="input"
          name="note"
          placeholder="note"
          value={form.note}
          onChange={handleChange}
        />
        <div style={{display:"flex", justifyContent:"space-around", width:"100%"}}><button type="submit">Add</button></div>
      </form>
      <div>{transMessage}</div>
      {(loading)?(<div className="spinner-container">
                                <div className="spinner"></div>
                                <p>Updating…</p>
                            </div>):(<></>)}
    </div>


    <div className="page">
      <h2>add category</h2>
      <form onSubmit={(e) => handleAdd(e)} className="form">
        <input required className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />

        <select className="input" value={type} onClick={(e) => setType(e.target.value)} onChange={(e) => setType(e.target.value)}>
          <option key="income" value="income">Income</option>
          <option key="expense" value="expense">Expense</option>
        </select>
        <div style={{display:"flex", justifyContent:"space-around", width:"100%"}}><button type="submit">Add</button></div>

      </form>
      <div>{message}</div>
      {(loading)?(<div className="spinner-container">
                                <div className="spinner"></div>
                                <p>Updating…</p>
                            </div>):(<></>)}
    
    </div>
  </div>
  );
}

export default TransactionForm;
