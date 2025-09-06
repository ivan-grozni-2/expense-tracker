import React, {useState, useContext} from "react";
import AuthContext from "../context/AuthContext";
import {useNavigate} from "react-router-dom";


function Login(){
    const {login} = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        console.log("user :",username)

        try{
            const response = await login(username, password);
            const data = await response.json();
            console.log("username ", localStorage.getItem("user"));

            if(data.error){
                console.log("error ", data.error);
                return;
            }

            navigate("/Dashboard");


        }catch (err) {
            setError("server error" , err);

        }
    };


    return(
        <div>
            <h2> Login </h2>
            <form onSubmit={handleSubmit}>
                <input
                type = "text"
                placeholder = "username"
                value = {username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type = "password"
                placeholder = "password"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="Submit"> login </button>
            </form>
            
            <button type = "register" onClick={() => {navigate("/register")}}> Create a new account</button>
            {error && <p style={{color: "red"}}>{error}</p> }
        </div>
    );


}

export default Login;