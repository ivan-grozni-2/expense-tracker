import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AuthContext from "./context/AuthContext";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Dashboard from "./page/Dashboard";


function App() {
  const { user} = useContext(AuthContext);

  return(
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
  
}

export default App;
