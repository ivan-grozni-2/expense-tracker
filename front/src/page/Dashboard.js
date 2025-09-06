import React, { useEffect, useState, useContext } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import Chart from "../components/Chart";
import Filters from "../components/Filters";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import { fetchTransactions } from "../App"

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState([]);
    const [month, setMonth] = useState([]);
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ month: "", category: "" });
    const { user, token, userid } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);


    const fetchTransactions = async (newFilters = {}) => {
        const applyFilters = { ...filters, ...newFilters };
        setFilters(newFilters);
        const query = new URLSearchParams(newFilters).toString();

        console.log("user is", token);

        try {
            const res1 = await fetch(`http://localhost:5000/transactions?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data1 = await res1.json();
            setTransactions(data1);

            const res2 = await fetch(`http://localhost:5000/transactions/summary?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data2 = await res2.json();
            setSummary(data2);

            const res3 = await fetch(`http://localhost:5000/transactions/summary/monthly?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data3 = await res3.json();
            setMonth(data3);

            const res4 = await fetch(`http://localhost:5000/transactions/total?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data4 = await res4.json();
            setTotal(data4.total);


        } catch (err) {
            console.error("Error fetching:", err);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetch("http://localhost:5000/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    function handleExport() {
        let query = "";
        if (filters.month || filters.category) {
            const params = new URLSearchParams(filters).toString();
            query = "?" + params;

        }

        window.open(`http://localhost:5000/transactions/export/csv${query}`, "_blank")
    };

    return (
        <div style={{ margin: "2rem" }}>
            <button onClick={async () => { await logout() }}> log out </button>
            <h1> Expense Tracker</h1>
            <Filters categories={categories} onFilter={fetchTransactions} />
            <TransactionForm
                transactions={transactions}
                setTransactions={setTransactions}
                categories={categories}
                fetchTransactions={fetchTransactions} />
            <button onClick={handleExport}> Export </button>
            <TransactionTable
                transactions={transactions}
                setTransactions={setTransactions}
                categories={categories}
                fetchTransactions={fetchTransactions}
            />
            <h3>TOTAL = ${total}</h3>
            <Chart data={summary} total={total} type="pie" title="Expenses by Category" />
            <Chart data={month} total={total} type="line" title="Monthly Expenses" />
        </div>
    );
}

export default Dashboard;
