import React from "react";
import "./home.css"
import Chart from "../components/Chart";
import Table from "../tables/table";

function Home({ allTransactions, burgerClass, setTab, loading }) {
    let shrink = "home";
    let totalcolor = "";
    let income = 0;
    let expense = 0;
    let total = 0;
    let incomeList = [];
    let expenseList = [];
    let incomeListcat = [];
    let expenseListcat = [];
    let monthly = [];
    let months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let uniquedate = new Set();


    if (burgerClass === "hamburger active") shrink = "home shrink";
    else shrink = "home"

    try {
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
        allTransactions.forEach(element => {
            if (element.category_type === "income") {
                income += Number(element.amount);
                incomeList.push({ ...{ category: element.category_name, amount: Number(element.amount), date: element.date.slice(0, 7) } });

            };
            if (element.category_type === "expense") {
                expense += Number(element.amount)
                expenseList.push({ ...{ category: element.category_name, total: Number(element.amount), date: element.date.slice(0, 7) } });

            };

            if (uniquedate.has(element.date.slice(0, 7))) {
                if (element.category_type === "income") monthly.find(entry => entry.date === element.date.slice(0, 7)).income += Number(element.amount);
                else if (element.category_type === "expense") monthly.find(entry => entry.date === element.date.slice(0, 7)).expense += Number(element.amount);

            } else {
                uniquedate.add(element.date.slice(0, 7))
                monthly.push({
                    ...{
                        date: element.date.slice(0, 7),
                        month: months[Number(element.date.split("-")[1])],
                        income: (element.category_type === "income") ? Number(element.amount) : 0,
                        expense: (element.category_type === "expense") ? Number(element.amount) : 0
                    }
                })
            }


        }
        );
        catagoryorder();

        function catagoryorder() {
            incomeListcat = [];
            for (const e of incomeList) {
                let exists = false;
                for (let cont of incomeListcat) {
                    if (cont.category === e.category) {
                        cont.amount += e.amount;
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    incomeListcat.push({ ...e });
                }
            }
            incomeListcat.sort((a, b) => b.amount - a.amount);
            expenseListcat = [];
            for (const e of expenseList) {
                let exists = false;
                for (let cont of expenseListcat) {
                    if (cont.category === e.category) {
                        cont.total += e.total;
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    expenseListcat.push({ ...e });
                }
            }
            expenseListcat.sort((a, b) => b.total - a.total);
        }


    } catch (err) {

    }
    income = income.toFixed(2);
    expense = expense.toFixed(2);
    total = income - expense;
    total = total.toFixed(2);

    if (total <= 0) totalcolor = "#f44336";
    else totalcolor = "#4caf50";

    return (<div className={shrink}>
        {(allTransactions.length === 0 && !loading) ?
            (<div style={{ display: "flex", justifyContent: "space-around", flexDirection: "column", alignItems: "center" }}>
                <h4> If you want to view reports and transaction you need to add a transaction here</h4>
                <button type="click" onClick={() => setTab(3)} style={{ maxWidth: "15rem" }}>Add transaction</button>
            </div>) : (

                <>
                    <div className="row">
                        <div className="dashboard-cards left">
                            <button id="addtransactiononcards" type="click"> Add Transaction</button>
                            <h2>Overall Balance</h2>
                            {loading ? (<div className="spinner-container">
                                <div className="spinner"></div>
                                <p>Loading data…</p>
                            </div>) : (<>
                                <h1 style={{ margin: "0", paddingLeft: "30px", color: totalcolor }}>${total}</h1>
                                <div className="card">
                                    <div className="cards income-card">
                                        <h3>Income: <p>${income}</p></h3>

                                        {incomeList.length === 0 ? (<></>) : (
                                            <div>
                                                <h3>top incomes</h3>
                                                <div className="lists">
                                                    <ol>
                                                        {incomeListcat.slice(0, 3).map((e, i) => (
                                                            <li key={i}>{e.category}</li>
                                                        ))


                                                        }
                                                    </ol>
                                                    <ul>
                                                        {incomeListcat.slice(0, 3).map((e, i) => (
                                                            <li key={i}>${e.amount.toFixed(2)}</li>
                                                        ))


                                                        }
                                                    </ul>

                                                </div>
                                            </div>)}
                                    </div>

                                    <div className="cards expense-card">
                                        <div>
                                            <h3>expense<p>${expense}</p></h3>

                                        </div>
                                        {expenseList.length === 0 ? (<></>) : (
                                            <div>
                                                <h3>top expenses</h3>
                                                <div className="lists">
                                                    <ol>
                                                        {expenseListcat.slice(0, 3).map((e, i) => (
                                                            <li key={i}>{e.category}</li>
                                                        ))


                                                        }
                                                    </ol>
                                                    <ul>
                                                        {expenseListcat.slice(0, 3).map((e, i) => (
                                                            <li key={i}>${e.total.toFixed(2)}</li>
                                                        ))


                                                        }
                                                    </ul>
                                                </div>
                                            </div>)
                                        }
                                    </div>
                                </div></>)}
                        </div>
                        <div className="dashboard-cards right">
                            <h2> Expense By Category</h2>
                            {loading ? (<div className="spinner-container">
                                <div className="spinner"></div>
                                <p>Loading data…</p>
                            </div>) : (<>
                                <Chart data={expenseListcat} type={"pie"} total={total} />
                            </>)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="dashboard-cards right">
                            <h2> monthly income and expense</h2>
                            {loading ? (<div className="spinner-container">
                                <div className="spinner"></div>
                                <p>Loading data…</p>
                            </div>) : (<>
                                <Chart data={monthly} type={"Bar"} />
                            </>)}
                        </div>
                        <div className="dashboard-cards left">
                            <h2> Recent Transactions</h2>

                            {loading ? (<div className="spinner-container">
                                <div className="spinner"></div>
                                <p>Loading data…</p>
                            </div>) : (<>
                                <Table data={allTransactions} />
                            </>)}
                        </div>
                    </div></>
            )}
    </div>
    )
}

export default Home;