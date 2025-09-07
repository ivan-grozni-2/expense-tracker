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



    const authFetch = async (url, options = {}) => {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...options.headers
            },
        });
        if (res.status === 401) {
            logout();
            console.error("Login has timed out, so please login again.");
        }

        return await res.json();
    };

    const save = () => {

    }

    const fetchTransactions = async (newFilters = {}) => {
        const applyFilters = { ...filters, ...newFilters };
        setFilters(newFilters);
        const query = new URLSearchParams(newFilters).toString();

        console.log("user is", token);

        try {
            const data1 = await authFetch(`http://localhost:5000/transactions?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setTransactions(data1);

            const data2 = await authFetch(`http://localhost:5000/transactions/summary?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setSummary(data2);

            const data3 = await authFetch(`http://localhost:5000/transactions/summary/monthly?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setMonth(data3);

            const data4 = await authFetch(`http://localhost:5000/transactions/total?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
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
                fetchTransactions={fetchTransactions}
                filters={filters}
            />
            <button onClick={handleExport}> Export </button>
            <TransactionTable
                transactions={transactions}
                setTransactions={setTransactions}
                categories={categories}
                fetchTransactions={fetchTransactions}
                filters={filters}
            />
            <h3>TOTAL = ${total}</h3>
            <Chart data={summary} total={total} type="pie" title="Expenses by Category" />
            <Chart data={month} total={total} type="line" title="Monthly Expenses" />
        </div>
    );
}

export default Dashboard;
