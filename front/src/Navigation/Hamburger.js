import React from "react";
import "./Hamburger.css"


function Hamburger({burgerClass, setBurgerClass, tabs, setTabs}) {
console.log(burgerClass);
    return (
        <section className={burgerClass}>
            <nav className="editors">
                <ul className="select">
                    <li onClick={() => setTabs(3)}>Add transaction</li>
                    <li onClick={() => setTabs(3)}>Add category</li>
                </ul>
            </nav>

        </section>
    );


}

export default Hamburger;