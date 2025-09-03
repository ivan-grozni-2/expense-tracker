import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

function Chart() {
    const [summary, setSummary] = useState([]);

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

    return (
        <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
            {summary.length === 0 ? (
                <p> no summary</p>
            ) : (
                <>
                    <pre>{JSON.stringify(summary, null, 2)}</pre>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={summary}
                            dataKey="total"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            label
                        >
                            {summary.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                        <XAxis dataKey="Category" />
                        <Bar dataKey="Total" fill="#82ca9d" />
                    </PieChart>

                    <BarChart
                        width={500}
                        height={500}
                        data={summary}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#82ca9d" />

                    </BarChart>
                </>)}
        </div>

    );
}

export default Chart;