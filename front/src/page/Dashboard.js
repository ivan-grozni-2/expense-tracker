import React, { useEffect, useState, useContext } from "react";
import TransactionForm from "../form/TransactionForm";
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

    const API_URL = process.env.REACT_APP_API_URL;


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
            const data1 = await authFetch(`${API_URL}/transactions?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            setTransactions(data1);

            const data4 = await authFetch(`${API_URL}/transactions/total?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            setTotal(data4.total);
            const data5 = await authFetch(`${API_URL}/categories?${query}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setCategories(data5);

            const data6 = await authFetch(`${API_URL}/transactions/user`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setUsername(data6)

            const data7 = await authFetch(`${API_URL}/transactions/all`, {
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
            const data = await authFetch(`${API_URL}/transactions/summary/monthly?${query}`, {
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
            const data = await authFetch(`${API_URL}/transactions/summary?${query}`, {
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
        fetch("${API_URL}/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);


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
                    <Home allTransactions={allTransactions} burgerClass={burgerClass} setTab={setTabs} />
                </>) : tabs === 1 ? (<>
                    <Report
                        burgerClass={burgerClass}
                        fetchMonthly={fetchMonthly}
                        monthly={month}
                        fetchSummary={fetchSummary}
                        summary={summary}
                        filters={filters}
                        fetchTransactions={fetchTransactions}
                        categories={categories} 
                        setTab={setTabs}
                        />
                </>) : tabs === 2 ? (<>
                    <TransactionTable
                        transactions={transactions}
                        setTransactions={setTransactions}
                        categories={categories}
                        fetchTransactions={fetchTransactions}
                        filters={filters}
                        total={total}
                        burgerClass={burgerClass}
                        setTab={setTabs}
                    />
                </>) : tabs === 3 ?(
                    <>
                        <TransactionForm
                            transactions={transactions}
                            setCategories={setCategories}
                            categories={categories}
                            fetchTransactions={fetchTransactions}
                            filters={filters}
                            burgerClass={burgerClass}
                            fetchSummary={fetchSummary}
                            fetchmonthly={fetchMonthly}
                        />
                        
                    </>
                ):(<></>)}
            </>
        </>

    )
}

export default Dashboard;
