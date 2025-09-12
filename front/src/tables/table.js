import React from "react";
import "./table.css"

function Table({ data }) {
    function color(type) {
        if (type === "income") return "#4caf5055";
        else return "#f4433655";
    }
    if(data.length === 0){
        return(<p> Please add a transaction to view its report here</p>
        )
    }
    return (
        <>{(typeof data !== "undefined") ? (
        <table>
            <thead>
                <tr key="head">
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>type</th>
                </tr>
            </thead>
            <tbody key="recent">
                {data.slice(0, 6).map((e,i) => (
                    <tr key={i} style={{ backgroundColor: color(e.category_type) }}>
                        <td>{e.date.split("T")[0]}</td>
                        <td>{e.category_name}</td>
                        <td>{e.amount}</td>
                        <td>{e.category_type}</td>

                    </tr>))}
            </tbody>
</table>):(
    <>
    <p> Please add a transaction to view its report here</p>

    </>
)}</>
    )
}

export default Table;