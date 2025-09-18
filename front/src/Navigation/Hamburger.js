import React from "react";
import "./Hamburger.css"


function Hamburger({ burgerClass, setBurgerClass, tabs, setTabs }) {

    return (
        <section className={burgerClass}>
            <nav className="editors">
                <ul className="select hidden">
                    <li onClick={() => setTabs(3)}>home</li>
                    <li onClick={() => setTabs(3)}>transactions</li>
                    <li onClick={() => setTabs(3)}>report</li>
                </ul>
                <div></div>
                <ul className="select">
                    <li onClick={() => setTabs(3)}>Add transaction</li>
                    <li onClick={() => setTabs(3)}>Add category</li>
                </ul>
            </nav>

        </section>
    );


}

export default Hamburger;