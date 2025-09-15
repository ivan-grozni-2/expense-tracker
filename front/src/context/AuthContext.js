import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [userid, setUserid] = useState(0);
    
    const API_URL = process.env.REACT_APP_API_URL;



    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");
        const savedId = localStorage.getItem("userid")
        try {
            if (savedUser && savedToken && (savedUser != undefined)) {
                setUser(JSON.parse(savedUser));
            }
                setToken(savedToken);
                setUserid(savedId);
            

        } catch (err) {
        }

    }, []);

    const login = async (username, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();


        if (res.ok) {
            setUser(username);
            setToken(data.token);
            setUserid(data.id);
            localStorage.setItem("user", JSON.stringify(username));
            localStorage.setItem("token", data.token);
            localStorage.setItem("userid", data.id);
        }else{
            return (data);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setUserid(0);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
    };

    return (
        <AuthContext.Provider value={{ user, token, userid, login, logout }}>
            {children}
        </AuthContext.Provider>
    );


}

export default AuthContext;