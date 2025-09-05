import React, { useState } from "react";

function Filters({categories, onFilter}){

    const[startmonth, setStartMonth] = useState("");
    const[endmonth, setEndMonth] = useState("");
    const[category, setCategory] = useState("");

    const handleFilter = () => {
        onFilter({startmonth, endmonth, category_id: category});
        
        console.log("filters:", { startmonth, endmonth, category_id: category })
    };


    const handleReset = () =>{
        setStartMonth("");
        setEndMonth("");
        setCategory("");
        onFilter({startmonth: "", endmonth: "", category_id: ""});
    };

    return(
        <>
        <h2>Filter</h2>
        <div style = {{ marginBottom: "1rem", display: "flex", gap: "1rem"}}>
           <input
                type="month"
                value={startmonth}
                onChange={(e) => setStartMonth(e.target.value)}
            />
            <input
                type="month"
                value={endmonth}
                onChange={(e) => setEndMonth(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <button onClick={handleFilter}>Apply</button>
            <button onClick={handleReset}>Reset</button>
        </div>
</>
    );


}
export default Filters;