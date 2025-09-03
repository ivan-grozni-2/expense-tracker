import React, { useState } from "react";

function Filters({categories, onFilter}){

    const[month, setMonth] = useState("");
    const[category, setCategory] = useState("");

    const handleFilter = () => {
        onFilter({month, category_id: category});
        
        console.log("filters:", { month, category_id: category })
    };


    const handleReset = () =>{
        setMonth("");
        setCategory("");
        onFilter({month: "", category_id: ""});
    };

    return(
        <div style = {{ marginBottom: "1rem", display: "flex", gap: "1rem"}}>
            <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
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

    );


}
export default Filters;