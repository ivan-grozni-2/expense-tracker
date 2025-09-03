import React, { useEffect, useState } from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";

function MonthlyChart(){
    const [monthly, setMonthly]= useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/transactions/summary/monthly")
        .then((res) => res.json())
        .then((data) => {
            const parsed = data.map((d) => ({month: months(d.month), total: Number(d.total)}));
            
            console.log("data :", parsed);
            setMonthly(parsed);
        })
        .catch((err) => {console.error("error fetching monthly:", err)})
    }, []);
    
    function months(str){
        if(str.includes("January")){
            
        return str 
        }else{
            return str.slice(5, str.length);
        }
    }
    
    
    
    return(
        <div style = {{marginTop: "2rem"}}>
            <h2>monthly expenses</h2>
            {monthly.length === 0 ? (
                <p>no monthly report</p>
                ):(
                <LineChart
                    width = {1100}
                    height ={300}
                    data = {monthly}
                    margin={{top : 20, right: 30, left: 20, bottom: 5}}
                >
                    <CartesianGrid strokeDasharray={"3 3"}/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line dataKey="total" stroke = "#8884d8" />
                    
                </LineChart>
            )}
        </div>
    )
}

export default MonthlyChart;