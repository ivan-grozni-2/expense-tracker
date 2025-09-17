import React, { useEffect } from "react";
import "./report.css"
import Chart from "../components/Chart";
import Filters from "../Filter/Filters";

function Report({ burgerClass, fetchMonthly, monthly, fetchSummary, summary, onFilter, fetchTransactions, categories, setTab, loading }) {

    let shrink = "report";

    if (burgerClass === "hamburger active") shrink = "report shrink";
    else shrink = "report";

    return (
        <div className={shrink}>
            <h2>By Category</h2>
            <div className="dashboard-cards">

                {(summary.length === 0 && !loading) ?
                    (<div style={{ display: "flex", justifyContent: "space-around", flexDirection: "column", alignItems: "center" }}>
                        <h4> If you want to view reports and transaction you need to add a transaction here</h4>
                        <button type="click" onClick={() => setTab(3)} style={{ maxWidth: "15rem" }}>Add transaction</button>
                    </div>) : (<>
                        <div className="row">
                            <div>
                                <Filters
                                    categories={categories}
                                    onFilter={fetchSummary}
                                    fetchTransactions={fetchSummary}
                                    vertical={false}
                                />
                            </div>
                            <div>
                                {loading ? (<>
                                    <p>loading...</p>
                                </>) : (<>
                                    <Chart data={summary}
                                        type="1bar"
                                    />
                                </>)}
                            </div>
                        </div>
                        <div className="row">
                            <div>
                                {loading ? (<>
                                    <p>loading...</p>
                                </>) : (<>
                                    <Chart data={summary}
                                        type="piein"
                                        title="Expenses by Category"
                                    />
                                </>)}
                            </div>
                            <div>
                                {loading ? (<>
                                    <p>loading...</p>
                                </>) : (<>
                                    <Chart data={summary}
                                        type="pieout"
                                        title="Expenses by Category"
                                    />
                                </>)}
                            </div>
                        </div>
                    </>
                    )}
            </div>
            <h2>By Date</h2>
            <div className="dashboard-cards line" style={{ width: "95%" }}> {(monthly.length === 0) ?
                (<div style={{ display: "flex", justifyContent: "space-around", flexDirection: "column", alignItems: "center" }}>
                    <h4> If you want to view reports and transaction you need to add a transaction here</h4>
                    <button type="click" onClick={() => setTab(3)} style={{ maxWidth: "15rem" }}>Add transaction</button>
                </div>) : (<>
                    <div>
                        <Filters categories={categories} onFilter={fetchMonthly} fetchTransactions={fetchMonthly} vertical={true} />
                    </div>
                    <div style={{ overflowX: "scroll", maxWidth: "80vw", height: "400", overflowY: "hidden" }}>
                        {loading ? (<>
                            <p>loading...</p>
                        </>) : (<>
                            <Chart data={monthly}
                                type="line"
                                title="Monthly Expenses"
                            />
                        </>)}
                    </div>
                </>
                )}
            </div>
        </div>
    )
}

export default Report;