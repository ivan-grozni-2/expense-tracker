import React, { useEffect, useState, useContext } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import CategoryAdd from "../components/CategoryAdd";
import Chart from "../components/Chart";
import Filters from "../components/Filters";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/navbar";
import DashboardCards from "../components/DashboardCards";
import "../styles/Dashboard.css"

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState([]);
    const [month, setMonth] = useState([]);
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ month: "", category: "" });
    const [income, setIncome] = useState([]);
    const [expense, setExpense] = useState([])
    const { user, token, userid } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const [exportMessage, setExportMessage] = ("")



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
            const data5 = await authFetch(`http://localhost:5000/categories?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setCategories(data5);


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
        if (filters.startmonth || filters.category_id || filters.endmonth || filters.revenue) {
            const params = new URLSearchParams(filters).toString();
            query = "?" + params;

        }

        /*fetch(`http://localhost:5000/transactions/export/csv${query}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }, "_blank")
            .then((res) => res.json())
            .then((data) =>{})
            .catch((err) => console.error("Error fetching categories:", err));*/

        fetch(`http://localhost:5000/transactions/export/csv${query}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => res.blob())
            .then((blob) => {

                console.log("the filters ", blob);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "transactions.csv";
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => setExportMessage("error exporting"));

    };

    return (
        <div style={{ marginLeft: "5rem" }}>
            <h1> Expense Tracker</h1>
            <Navbar logout={logout}/>
            <DashboardCards transactions={transactions}/>
            <Filters categories={categories} onFilter={fetchTransactions} fetchTransactions={fetchTransactions} />
            <CategoryAdd
                setCategories={setCategories}
                fetchTransactions={fetchTransactions}
                filters={filters}
            />
            <TransactionForm
                transactions={transactions}
                setTransactions={setTransactions}
                categories={categories}
                fetchTransactions={fetchTransactions}
                filters={filters}
            />
            <button onClick={() => handleExport()}> Export </button>
            <TransactionTable
                transactions={transactions}
                setTransactions={setTransactions}
                categories={categories}
                fetchTransactions={fetchTransactions}
                filters={filters}
                total={total}
            />
            <Chart data={summary}
                total={total}
                type="pie"
                title="Expenses by Category"
                income={income}
                setIncome={setIncome}
                expense={expense}
                setExpense={setExpense}
            />
            <Chart data={month}
                total={total}
                type="line"
                title="Monthly Expenses"
                income={income}
                setIncome={setIncome}
                expense={expense}
                setExpense={setExpense}
            />
        </div>
    );
}

export default Dashboard;
