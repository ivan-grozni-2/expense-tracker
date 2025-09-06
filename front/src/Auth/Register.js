import React, {useState, useContext} from "react"; 
import AuthContext from "../context/AuthContext";

function Register(){
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async(e) => {
        e.preventDefault();

        console.log("user :",username)

        try{
            setError(null);
            const response = await fetch("http://localhost:5000/auth/register", {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password, email}),
            });
            const data = await response.json();
            console.log("response :", response);

            if (response.ok){
                
                console.log("what data :", data)
                login(username, password);
                console.log(response.message);
            }else{
                setError(data.error|| "registration failed");
            }
        }catch(err){
            setError("serverERR");
        }
    };

    return(
        <div>
            <h2> Registration </h2>
            <form onSubmit={handleSubmit}>
                <input
                type="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <button type="Submit"> Register </button>
            </form>
            {error && <p style={{color :"red"}}>{error}</p>}
        </div>
    );

}

export default Register;