import React from "react";
import "../styles/navbar.css";

function Navbar({logout}) {
    return (
        <nav className="navbar">
            <h1 className="logo">Expense Tracker</h1>
            <ul className="nav-links">
                <li>Dashboard</li>
                <li>Transactions</li>
                <li>Categories</li>
                <li onClick={logout} style={{cursor:"pointer"}}>Loguot</li>
            </ul>
        </nav>
    );
}

export default Navbar;
