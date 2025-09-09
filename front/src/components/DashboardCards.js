import React from "react";
import "../styles/DashboardCards.css";

function DashboardCards ({transactions}){

    let income = 0;
    let expense = 0;
    let total = 0;

    transactions.forEach(element => {
        if(element.category_type == "income") {
            income += Number(element.amount);
            
        };
        if(element.category_type == "expense") {
            expense +=Number(element.amount)

        };
    });
    income = 0.01 * (Math.round(income * 100));
    expense = 0.01 * (Math.round(expense * 100));
    total = income-expense;

    return(
        <div className="dashboard-cards">
            <div className="card income-card">
                <h3>Income</h3>
                <p>${income}</p>
            </div>

            <div className="card expense-card">
                <h3>expense</h3>
                <p>${expense}</p>
            </div>
            <div className="card total-card">
                <h3>total</h3>
                <p>${total}</p>
            </div>

        </div>
    )

}

export default DashboardCards;