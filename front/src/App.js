import React, { useEffect, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionTable from "./components/TransactionTable";
import Chart from "./components/Chart";
//import MonthlyChart from "./components/MonthlyChart";
import Filters from "./components/Filters";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [month, setMonth] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchTransactions = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();

    try {
      const res1 = await fetch(`http://localhost:5000/transactions?${query}`);
      const data1 = await res1.json();
      setTransactions(data1);

      const res2 = await fetch(`http://localhost:5000/transactions/summary?${query}`);
      const data2 = await res2.json();
      setSummary(data2);

      console.log("data2 :", data2);

      const res3 = await fetch(`http://localhost:5000/transactions/summary/monthly?${query}`);
      const data3 = await res3.json();
      setMonth(data3);
    } catch (err) {
      console.error("Error fetching:", err);
    }

    /*fetch(`http://localhost:5000/transactions?${query}`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Error fetching transactions:", err));

    fetch(`http://localhost:5000/transactions/summary?${query}`)
      .then((res) => res.json())
      .then((data) => setSummary(data.map((d) => ({...d, total: Number(d.total)}))))
      .catch((err) => console.error("Error fetching summary:", err));

    fetch(`http://localhost:5000/transactions?${query}`)
      .then((res) => res.json())
      .then((data) => setMonthly(data.map((d) => ({month: months(d.month), total: Number(d.total)}))))
      .catch((err) => console.error("Error fetching transactions:", err));

*/
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
      <Filters categories={categories} onFilter={fetchTransactions} />
      <TransactionForm onAdd={fetchTransactions} categories={categories} />
      <TransactionTable
        transactions={transactions}
        onDelete={fetchTransactions}
        onEdit = {fetchTransactions}
        categories={categories}
      />
      <Chart data={summary} type="pie" title="Expenses by Category" />
      <Chart data={month} type="line" title="Monthly Expenses" />
    </div>
  );
}

export default App;
