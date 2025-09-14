import React, { useEffect, useState, useContext } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../tables/TransactionTable";
import CategoryAdd from "../components/CategoryAdd";
import Chart from "../components/Chart";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/navbar";
import DashboardCards from "../components/DashboardCards";
import Hamburger from "../Navigation/Hamburger";
import "../styles/Dashboard.css"
import Home from "../pages/Home";
import Report from "../Report/Report";

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
    const [exportMessage, setExportMessage] = ("");
    const [username, setUsername] = useState("");
    const [burgerClass, setBurgerClass] = useState("hamburger");
    const [allTransactions, setAllTransaction] = useState([])
    const [tabs, setTabs] = useState(0);



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



    const fetchTransactions = async (newFilters = {}) => {
        setFilters(newFilters);
        const query = new URLSearchParams(newFilters).toString();

        try {
            const data1 = await authFetch(`http://localhost:5000/transactions?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            setTransactions(data1);

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

            const data6 = await authFetch(`http://localhost:5000/transactions/user`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setUsername(data6)

            const data7 = await authFetch(`http://localhost:5000/transactions/all`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setAllTransaction(data7)


        } catch (err) {
            console.error("Error fetching:", err);
        }
    };

    const fetchMonthly = async (newFilters = {}) => {
        setFilters(newFilters);
        const query = new URLSearchParams(newFilters).toString();
        try {
            const data = await authFetch(`http://localhost:5000/transactions/summary/monthly?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            data.forEach(element => {
                element.total = Number(element.total);
            });
            setMonth(data);
        } catch (err) {
            console.error("Error fetching:", err);
        }
    };

    const fetchSummary = async (newFilters = {}) => {
        setFilters(newFilters);
        const query = new URLSearchParams(newFilters).toString();
        try {
            const data = await authFetch(`http://localhost:5000/transactions/summary?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            data.forEach(element => {
                element.total = Number(element.total);
            });
            setSummary(data);
        } catch (err) {
            console.error("Error fetching:", err);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchMonthly();
        fetchSummary();
        fetch("http://localhost:5000/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);


    /*return (
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
    );*/

    console.log("tab is ", tabs);

    return (
        <>
            <Hamburger
                burgerClass={burgerClass}
                setBurgerClass={burgerClass}
                tabs={tabs}
                setTabs={setTabs} />
            <Navbar
                logout={logout}
                username={username}
                burgerClass={burgerClass}
                setBurgerClass={setBurgerClass}
                tabs={tabs}
                setTabs={setTabs}
            />
            <>
                {tabs === 0 ? (<>
                    <Home allTransactions={allTransactions} burgerClass={burgerClass} />
                </>) : tabs === 1 ? (<>
                    <Report
                        burgerClass={burgerClass}
                        fetchMonthly={fetchMonthly}
                        monthly={month}
                        fetchSummary={fetchSummary}
                        summary={summary}
                        filters={filters}
                        fetchTransactions={fetchTransactions}
                        categories={categories} />
                </>) : tabs === 2 ? (<>
                    <TransactionTable
                        transactions={transactions}
                        setTransactions={setTransactions}
                        categories={categories}
                        fetchTransactions={fetchTransactions}
                        filters={filters}
                        total={total}
                        burgerClass={burgerClass}
                    />
                </>) : tabs === 3 ?(
                    <>
                        <TransactionForm
                            transactions={transactions}
                            setCategories={setCategories}
                            categories={categories}
                            fetchTransactions={fetchTransactions}
                            filters={filters}
                        />
                        
                    </>
                ):(<></>)}
            </>
        </>

    )
}

export default Dashboard;
