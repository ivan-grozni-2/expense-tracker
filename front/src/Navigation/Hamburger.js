import React from "react";
import "./Hamburger.css"


function Hamburger({burgerClass, setBurgerClass}) {
console.log(burgerClass);
    return (
        <section className={burgerClass}>
            <nav className="editors">
                <ul className="select">
                    <li>Add transaction</li>
                    <li>Add category</li>
                </ul>
            </nav>

        </section>
    );


}

export default Hamburger;