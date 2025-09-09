import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

function CategoryAdd({ setCategories, fetchTransactions, filter }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const { token } = useContext(AuthContext)


    function handleAdd(e) {
        e.preventDefault();

        console.log("name " + name + " type " + type)
        if (name && type) {
            fetch(`http://localhost:5000/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name: name, type: type })

            }).then((res) => res.json())
                .then((data) => {
                    if(data.error) setMessage(data.error);
                    else setMessage(data.message + ". Category is " + name);
                })
                .catch((err) => { 
                    setMessage(err);
                    console.error(err) 
                });
                fetchTransactions(filter);

        } else {
            setMessage("Please fill every form")
        }
    };

    return (
        <div style={{ marginBottom: "15px" }}>
            <form onSubmit={(e) => handleAdd(e)}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
                <select value={type} onClick={(e) => setType(e.target.value)} onChange={(e) => setType(e.target.value)}>
                    <option key="income" value="income">Income</option>
                    <option key="expense" value="expense">Expense</option>
                </select>
                <button type="Submit"> Add </button>

            </form>
            <div>{message}</div>
        </div>
    );


}

export default CategoryAdd;

