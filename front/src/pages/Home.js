import React, { useState } from "react";
import "./home.css"

function Home({ allTransactions, burgerClass }) {
    let shrink = "home";
    let totalcolor = "";
    let income = 0;
    let expense = 0;
    let total = 0;
    let incomeList = [];
    let expenseList = [];
    let topincomes = [];
    let topexpences = [];



    if (burgerClass == "hamburger active") shrink = "home shrink";
    else shrink = "home"

    try {
        allTransactions.forEach(element => {
            if (element.category_type == "income") {
                income += Number(element.amount);
                incomeList.push({category: element.category_name, amount: element.amount, date: element.date.slice(0,7)});

            };
            if (element.category_type == "expense") {
                expense += Number(element.amount)
                expenseList.push({category: element.category_name, amount: element.amount, date: element.date.slice(0,7)});

            };

        });

        function combine(data){


            return data;
        }


    } catch (err) {

    }
    income = income.toFixed(2);
    expense = expense.toFixed(2);
    total = income - expense;
    total = total.toFixed(2);

    if (total <= 0) totalcolor = "#f44336";
    else totalcolor = "#4caf50";
    console.log(" total " + total + " color " + totalcolor)


    return (<div className={shrink}>
        <div className="dashboard-cards">

            <h2>Overall Balance</h2>
            <h1 style={{ margin: "0", paddingLeft: "30px", color: totalcolor }}>${total}</h1>
            <div className="card">
                <div className="cards income-card">
                    <h3>Income</h3>
                    <p>${income}</p>
                     {incomeList.length == 0 ? (<></>):(
                        <div>
                        <h4>top incomes</h4>
                       <ol>
                            {incomeList.map((e,i) => (
                                    <li>{e.category} cost {e.amount}</li>
                            ))


                            }
                        </ol>
                    </div>)}
                </div>

                <div className="cards expense-card">
                    <div>
                        <h3>expense</h3>
                        <p>${expense}</p>
                    </div>
                     {expenseList.length == 0 ? (<></>):(
                        <div>
                        <h4>top expenses</h4>
                       <ol>
                            {expenseList.map((e,i) => (
                                    <li>{e.category} $ {e.amount}</li>
                            ))


                            }
                        </ol>
                    </div>)}
                </div>
            </div>
        </div>
        <div>

        </div>
    </div>
    )
}

export default Home;