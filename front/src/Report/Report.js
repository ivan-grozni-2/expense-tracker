import React from "react";
import "./report.css"
import Chart from "../components/Chart";
import Filters from "../Filter/Filters";

function Report({ burgerClass, fetchMonthly, monthly, fetchSummary, summary, onFilter, fetchTransactions, categories }) {

    let shrink = "report";

    if (burgerClass === "hamburger active") shrink = "report shrink";
    else shrink = "report";

    return (
        <div className={shrink}>
            <h1>By Category</h1>
            <div className="dashboard-cards">
                <div className="row">
                    <div>
                        <Filters categories={categories} onFilter={fetchSummary} fetchTransactions={fetchSummary} vertical={false} />
                    </div>
                    <div>
                        <Chart data={summary}
                            type="1bar"
                        />
                    </div>
                </div>
                <div className="row">
                    <div>
                        <Chart data={summary}
                            type="piein"
                            title="Expenses by Category"
                        />
                    </div>
                    <div>
                        <Chart data={summary}
                            type="pieout"
                            title="Expenses by Category"
                        />
                    </div>
                </div>
            </div>
            <h1>By Date</h1>
            <div className="dashboard-cards line">
                <div>
                    <Filters categories={categories} onFilter={fetchMonthly} fetchTransactions={fetchMonthly} vertical={true} />
                </div>
                <div>
                    <Chart data={monthly}
                        type="line"
                        title="Monthly Expenses"
                    /></div>
            </div>
        </div>
    )
}

export default Report;