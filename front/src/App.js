import React, { useEffect, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionTable from "./components/TransactionTable";
import Chart from "./components/Chart";
import MonthlyChart from "./components/MonthlyChart";
import Filters from "./components/Filters";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchTransactions = (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    console.log("APP query : ", query);
    fetch(`http://localhost:5000/transactions?${query}`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Error fetching transactions:", err));
  };

  useEffect(() => {
    fetchTransactions();
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div style={{ margin: "2rem" }}>
      <h1> Expense Tracker</h1>
      <Filters categories = {categories} onFilter = {fetchTransactions}/>
      <TransactionForm setTransactions={setTransactions} categories={categories} />
      <TransactionTable
        transactions={transactions}
        setTransactions={setTransactions}
        categories={categories}
      />
      <Chart/>
      <MonthlyChart/>
    </div>
  );
}

export default App;
