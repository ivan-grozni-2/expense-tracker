//import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ReferenceLine } from "recharts";

const greens = ["#D1FAE5", "#A7F3D0", "#34D399", "#059669", "#065F46"]
const reds = ["#FEE2E2", "#FCA5A5", "#F87171", "#DC2626", "#7F1D1D"]
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
*/try {
        if (data.error) {
            return (<>
                {data.error && <h3 style={{ color: "red" }}> {data.error} </h3>};
            </>);
        }
        if (data.length !== 0) {
            data = data.map((d) => ({ ...d, total: d.total.toFixed(2) }));
            data = data.map((d) => ({ ...d, total: Number(d.total) }));

            data.map((e) => {

            })
        }
    } catch (err) {

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

    function gradientcolor(data, value, revenue) {
        let max = 0;
        let sum = 0;
        data.forEach((e) => {
            if (max < e.total)
                max = e.total;
        });
        let min = max;
        data.forEach((e) => {
            if (min > e.total)
                min = e.total;
        });
        data.forEach((e) => {
            sum += e.total;
        });

        const middle = (sum / data.length) / max;
        const avg = (value / max);

        if (revenue == "income") {
            return "rgb(" + (((6 - 210) * (avg)) + 210) + "," + (((120 - 250) * avg) + 250) + "," + (((40 - 230) * avg) + 240) + ")";
        } else if (revenue == "neutral") {
            if (avg > middle) {
                return "rgb(" + (((244 - (33)) * ((avg - middle) / (1 - middle))) + 33) + "," + (((67 - 150) * ((avg - middle) / (1 - middle))) + 150) + "," + (((54 - 243) * ((avg - middle) / (1 - middle))) + 243) + ")"
            }
            else if (avg <= middle) {
                return "rgb(" + (((33 - (76)) * ((avg - middle) / (1 - middle))) + 76) + "," + (((150 - 175) * ((avg - middle) / (1 - middle))) + 175) + "," + (((243 - 80) * ((avg - middle) / (1 - middle))) + 80) + ")"
            }
            //--color-neutral : rgb(33, 150, 243);
            //--color-income : rgb(76, 175, 80);
            //--color-expense : rgb(244, 67, 54);
        }

        return "rgb(" + (((170 - 255) * avg) + 255) + "," + (((30 - 225) * avg) + 225) + "," + (((30 - 225) * avg) + 225) + ")";

    }

    function selectColor() {
        if (total() > 0) {
            return "rgb(76, 175, 80)"
        } else {

            return "rgb(244, 67, 54)"
        }
    }

    if (data.length === 0) {
        return (
            <p> Please add a transaction to view its report here</p>

        )
    }
    if (type === "pie") {
        return (<>
            <h3 style={{ color: selectColor() }}>Total: ${total()}</h3>

            <PieChart width={450} height={300}>
                <Pie
                    data={data}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    fill="#8884d8"
                    outerRadius={100}
                    innerRadius={70}
                    label
                >
                    {data.map((entry, index, array) => (
                        <Cell key={`cell-${index}`} fill={gradientcolor(array, entry.total, "neutral")} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }} />
                <XAxis dataKey="category" />
            </PieChart>
        </>)
    } else if (type === "Bar") {
        return (<>
            <BarChart
                width={500}
                height={400}
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="rgb(76, 175, 80)" />
                <Bar dataKey="expense" fill="rgb(244, 67, 54)" />

            </BarChart>
        </>)
    } else if (type === "piein") {
        return (<>
            {data.length === 0 ? (
                <p> no summary</p>
            ) : (
                <div>
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
                            {datarev("income").map((entry, index, array) => (
                                <Cell key={`cell-${index}`} fill={gradientcolor(array, entry.total, "income")} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                        <XAxis dataKey="Category" />
                        <Bar dataKey="Legend" fill="#82ca9d" />
                    </PieChart>
                </div>
            )}
        </>)
    }
    else if (type === "pieout") {
        return (<>
            {data.length === 0 ? (
                <p> no summary</p>
            ) : (
                <>
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
                            {datarev("expense").map((entry, index, array) => (
                                <Cell key={`cell-${index}`} fill={gradientcolor(array, entry.total, "expense")} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                        <XAxis dataKey="Category" />
                    </PieChart>

                </>)}
        </>)
    } else if (type === "1bar") {
        return (<>
            {data.length === 0 ? (
                <p> no summary</p>
            ) : (
                <>
                    <h3>Comparison by Category</h3>
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
                        <Bar dataKey="total" fill="#82ca9d" />

                    </BarChart>
                </>)}
        </>)
    } else if (type === "line") {
        return (<>
            {data.length === 0 ? (
                <p> no summary</p>
            ) : (
                <>
                    <h3>Through time</h3>
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
                </>)}
        </>)
    }



    /*   return (
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
                                           {datarev("income").map((entry, index, array) => (
                                               <Cell key={`cell-${index}`} fill={color(array, entry.total, "income")} />
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
                                           {datarev("expense").map((entry, index, array) => (
                                               <Cell key={`cell-${index}`} fill={color(array, entry.total, "expense")} />
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
       );*/
}

export default Chart;