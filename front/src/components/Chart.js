//import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ReferenceLine } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

function Chart({ data, type, title, income, setincome, expense, setexpense }) {
    /*const [summary, setSummary] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/transactions/summary")
            .then((res) => res.json())
            .then((data) => {
                console.log("summary :", data);
                const parsed = data.map((d) => ({...d, total: Number(d.total)}));

                setSummary(parsed);
            })
            .catch((err) => console.error("Error fetching summary:", err));
    }, []);
*/

    if (data.error) {
        return (<>
            {data.error && <h3 style={{ color: "red" }}> {data.error} </h3>};
        </>);
    }
    if (data.length !== 0) {
        data = data.map((d) => ({ ...d, total: Number(d.total) }));
        data.map((e) => {

        })
    }

    const datarev = (type) => {
        let filtered = [];
        filtered = data.map((e) => ({ ...e }))
        filtered = filtered.map((e) => {
            if (e.category_type == type) return (e);
        });
        filtered = filtered.filter((f) => f != undefined);
        if (filtered.length != 0) {
            filtered.forEach((e) => {
                if (e.total < 0) {
                    e.total = (e.total * -1);
                }
            });
        }
        return filtered;
    }

    function total() {
        let total = 0;
        data.forEach((d) => {
            total += d.total;
        });
        return (Math.round(total * 100)) / 100;
    }

    return (
        <>
            <h2>{title}</h2>
            <h3>Total: ${total()}</h3>
            {type === "pie" ? (
                <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
                    {data.length === 0 ? (
                        <p> no summary</p>
                    ) : (
                        <>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <h3>Incomes</h3>
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            data={datarev("income")}
                                            dataKey="total"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            fill="#8884d8"
                                            label
                                        >
                                            {datarev("income").map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                        <XAxis dataKey="Category" />
                                        <Bar dataKey="Legend" fill="#82ca9d" />
                                    </PieChart>
                                    <h3>Expenses</h3>
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            data={datarev("expense")}
                                            dataKey="total"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            fill="#8884d8"
                                            label
                                        >
                                            {datarev("expense").map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                        <XAxis dataKey="Category" />
                                        <Bar dataKey="legend" fill="#82ca9d" />
                                    </PieChart>
                                </div>

                                <BarChart
                                    width={500}
                                    height={500}
                                    data={data}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total" fill="#82ca9d" />

                                </BarChart>
                            </div>
                        </>)}
                </div>

            ) : (
                <>
                    <div style={{ marginTop: "2rem" }}>
                        {data.length === 0 ? (
                            <p>no monthly report</p>
                        ) : (
                            <LineChart
                                width={1100}
                                height={300}
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray={"3 3"} />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <ReferenceLine y={0} stroke="black" label="Threshold" />
                                <Line dataKey="total" stroke="#8884d8" />

                            </LineChart>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default Chart;