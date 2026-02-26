// Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <div className="nav-container">
                <a href="/" className="nav-logo">
                    <span className="logo-box">S</span>
                    <span>Stockflow</span>
                </a>

                <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <a href="/" className="active">Home</a>
                    <a href="/inventory">Inventory</a>
                    <a href="/orders">Orders</a>
                    <a href="/analytics">Analytics</a>
                    <a href="/reports">Reports</a>

                    <div className="nav-buttons">
                        <button
                            className="nav-btn nav-btn-secondary"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button className="nav-btn nav-btn-primary"
                                onClick={() => navigate("/signin")}
                        >Sign Up</button>
                    </div>

                    <div className="nav-dropdown">
                        <div className="nav-avatar">JD</div>
                        <div className="nav-dropdown-content">
                            <a href="/profile">Profile</a>
                            <a href="/settings">Settings</a>
                            <a href="/logout">Logout</a>
                        </div>
                    </div>
                </div>

                <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;