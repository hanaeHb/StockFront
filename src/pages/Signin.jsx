// signin.jsx
import React from "react";
import "./signin.css";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaGoogle,
    FaFacebookF
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

export default function SignIn() {
    const navigate = useNavigate();
    return (
        <div className="signin-wrapper">
            <div className="signin-card">
                {/* LEFT PANEL */}
                <div className="left-panel">
                    <div className="left-content">
                        <h1>
                            Get Started<br/>with Us
                        </h1>
                        <p className="subtitle">
                            Let’s make StockFlow fun! Just follow these steps to create your account.
                        </p>

                        <div className="steps">
                            <div className="step active">
                                <div className="circle">1</div>
                                <span>Sign up your </span>
                                <span>account</span>
                            </div>

                            <div className="step">
                                <div className="circle">2</div>
                                <span>Set up your</span>
                                <span>workspace</span>
                            </div>

                            <div className="step">
                                <div className="circle">3</div>
                                <span>Set up your</span>
                                <span>profile</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="right-panel">
                    <div className="form-box">
                        <h2>JOIN <span>Stockflow</span></h2>

                        <p className="form-sub">
                            Manage smarter. Grow faster.</p>
                        <p className="form-sum">
                            Sign in to StockFlow and transform the way you handle your inventory.
                        </p>
                        <div className="row">
                            <div className="input-group">
                                <FaUser className="input-icon"/>
                                <input placeholder="First Name..."/>
                            </div>

                            <div className="input-group">
                                <FaUser className="input-icon"/>
                                <input placeholder="Last Name..."/>
                            </div>
                        </div>

                        <div className="input-group">
                            <FaEnvelope className="input-icon"/>
                            <input placeholder="Enter your Email..."/>
                        </div>

                        <div className="input-group">
                            <FaLock className="input-icon"/>
                            <input type="password" placeholder="Enter your password..."/>
                        </div>

                        <small className="hint">Must be at least 8 characters.</small>

                        <button className="signup-btn">Sign Up</button>

                        <div className="or">OR SIGN UP WITH</div>

                        <div className="socials">
                            <button className="social-btn">Google</button>
                            <button className="social-btn">Facebook</button>
                        </div>

                        <p className="login-link">
                            Already have an account? <span onClick={() => navigate("/login")}>Log in</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

