import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css"


function Login() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
 
        localStorage.clear();

        try {
            setError(null)
            const response = await login(username, password);

            if (!response.error) {
                navigate("/Dashboard");
            } else {
                setError(response.error|| "registration failed");
            }
        } catch (err) {
            setError("serverERR");
        }
    };


    return (
        <div className="body">
            <div className="dashboard-cards frontline">
                <h1> Login </h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="input"
                        type="text"
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
                    <button type="Submit"> login </button>
                </form>

                <Link id="register" to="/register"> Create a new account</Link>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );


}

export default Login;