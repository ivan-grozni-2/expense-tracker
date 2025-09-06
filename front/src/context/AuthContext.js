import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [userid, setUserid] = useState(0)

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
        const res = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        console.log("saved user", data);

        /*fetch("http://localhost:5000/auth/login", {
            method: "POST",
            header: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => res.json())
            .then((data) => {setTokens(data);
                console.log("data is : ", data);
            })
            .catch((err) => console.error("Error fetching login:", err));

        console.log("saved user", tokens); */
        if (res.ok) {
            setUser(username);
            setToken(data.token);
            setUserid(data.id);
            localStorage.setItem("user", JSON.stringify(username));
            localStorage.setItem("token", data.token);
            localStorage.setItem("userid", data.id);
        }else{
            return (data.error || {error:"cannto login"});
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