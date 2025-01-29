// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useUser } from "./context/UserContext"; // Import the UserContext
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login"; // Import the Login screen

const App = () => {
    const { user } = useUser(); // Access the logged-in user from context


    return (
        <Router>
            <div className="app">
                {user && <Header />} {/* Show header only if user is logged in */}
                <Routes>
                    <Route path="/" element={user ? <Home /> : <Login />} />
                    <Route path="/stages" element={<Home />} />
                </Routes>
                {user && <Footer />}
            </div>
        </Router>
    );
};

export default App;
