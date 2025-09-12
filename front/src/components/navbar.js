import React, { useState } from "react";
import "../styles/navbar.css";

function Navbar({ logout, username, setBurgerClass, burgerClass, tabs, setTabs }) {
    const [menu, setMenu] = useState("menu")
    let toggle = false;
    let initials = username.slice(0,2);
    const splitted = username.split(" ");

    /*for (let i = 0; (i < 2 && i < splitted.length); i++) {
        initials += splitted[i][0];
    }*/
   
    if (initials !== "undefined") initials = initials.toUpperCase();
    else initials = "";

    function hamburgers() {
        if (burgerClass == "hamburger") {
            setMenu("menu active");
            setBurgerClass("hamburger active");
        }
        else {
            setMenu("menu");
             setBurgerClass("hamburger");
        }
    }

    function current(x){
        if(x === tabs) return "current";
        return "";
    }

    return (
        <div className="navigator">
            <section className="header">
                <div className="title">
                    <button className={menu} type="click" onClick={hamburgers}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <h1 className="logo">Expense Tracker</h1>
                </div>
                <nav className="navbar">
                    <ul className="nav-links">
                        <li className={current(0)} onClick={() => setTabs(0)}>Home</li>
                        <li className={current(1)} onClick={() => setTabs(1)}>Report</li>
                        <li className={current(2)} onClick={() => setTabs(2)}>transactions</li>
                    </ul>
                </nav>
                <div className="user">
                    <h4 className="name">{initials}</h4>
                    <button type="click" id="logout" onClick={logout}>LOGOUT</button>
                </div>
            </section>
            <section>

            </section>
        </div>

    );
}

export default Navbar;
