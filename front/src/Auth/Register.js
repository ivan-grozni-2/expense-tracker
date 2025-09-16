import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./auth.css"

function Register() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    
    const API_URL = process.env.REACT_APP_API_URL;



    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("user :", username)

        try {
            setError(null);
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email }),
            });
            const data = await response.json();

            if (response.ok) {

                console.log("what data :", data)
                login(username, password);
            } else {
                setError(data.error || "registration failed");
            }
        } catch (err) {
            setError("serverERR");
        }
    };

    return (
        <div className="body">
            <div className="dashboard-cards frontline">
                <h1> Registration </h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="input"
                        type="username"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="input"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        className="input"
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="Submit"> Register </button>
                </form>
                <p>Already have an account
                <br/>
                <Link id="register" href="/login" type="register">Login</Link></p>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );

}

export default Register;