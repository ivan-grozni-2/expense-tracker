import React, { useState } from "react";
import "./filter.css"

function Filters({ categories, onFilter, fetchTransactions, vertical }) {

    const [startmonth, setStartMonth] = useState("");
    const [endmonth, setEndMonth] = useState("");
    const [category, setCategory] = useState("");
    const [revenue, setRevenue] = useState("");
    const [hide, setHide] = useState(true);

    const handleFilter = () => {
        onFilter({ startmonth, endmonth, category_id: category, revenue });
        fetchTransactions(onFilter);
    };


    const handleReset = () => {
        setStartMonth("");
        setEndMonth("");
        setCategory("");
        setRevenue("");
        onFilter({ startmonth: "", endmonth: "", category_id: "", revenue: "" });
        fetchTransactions(onFilter);
    };

    return (
        <div className="filter-container">
            <h2>Filter  <button type="click" id="hide" onClick={() => setHide(!hide)}>{hide? ("▲"):("▼")}</button>
            </h2>
            {!hide ?(<>
            <div className={vertical ? "filters" : "filters vertical"}>
                <div className={vertical ? "content" : "content vertical"}>
                    <h3>Time Period</h3>
                    <div className="cardbox">
                        <input
                            className="input"
                            type="text"
                            onFocus={(e) => e.target.type = 'month'}
                            onBlur={(e) => e.target.type = 'text'}
                            value={startmonth}
                            placeholder="Start Month"
                            name="Start Month"
                            onChange={(e) => setStartMonth(e.target.value)}
                        />
                        <input
                            className="input"
                            type="text"
                            onFocus={(e) => e.target.type = 'month'}
                            onBlur={(e) => e.target.type = 'text'}
                            value={endmonth}
                            placeholder="End Month"
                            onChange={(e) => setEndMonth(e.target.value)}
                        />
                    </div>
                </div>
                <div className={vertical ? "content" : "content vertical"}>
                    <h3>Category</h3>
                    <div className="cardbox">
                        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">All</option>
                            {(categories)?(categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))):(<></>)}
                        </select>

                    </div>
                </div>

                <div className={vertical ? "content" : "content vertical"}>
                    <h3>Revenue type</h3>
                    <div className="cardbox submit">
                        <input className="input" type="radio" name="revenue" value="income" checked={revenue == "income"} onChange={(e) => setRevenue("income")} />
                        <label >income</label><br />
                        <input className="input" type="radio" name="revenue" value="expense" checked={revenue == "expense"} onChange={(e) => setRevenue("expense")} />
                        <label >expense</label><br />
                        <input className="input" type="radio" name="revenue" value="income" checked={revenue == ""} onChange={(e) => setRevenue("")} />
                        <label >all</label><br /><br />
                    </div>
                </div>
            </div>
            <div className="filter-buttons">
                <button onClick={handleFilter}>Apply</button>
                <button onClick={handleReset}>Reset</button>
            </div></>): null}

        </div>
    );


}
export default Filters;