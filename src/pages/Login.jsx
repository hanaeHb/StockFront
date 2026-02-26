import React from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaBox,
    FaFacebookF, FaChartBar, FaBolt, FaMobileAlt
} from "react-icons/fa";

export default function Login() {
    const navigate = useNavigate();
    return (
        <div className="container">

            {/* LEFT SIDE */}
            <div className="left">

                <h2 className="title">
                    <span>Welcome</span> BACK
                </h2>

                <p className="form-sub">
                    Manage smarter. Grow faster.</p>
                <p className="form-sum">
                    Access your StockFlow account to streamline your inventory, gain real-time insights, and make smarter decisions that drive your business forward.
                </p>
                <div className="input-group">
                    <FaEnvelope className="input-icon"/>
                    <input placeholder="Enter your Email..."/>
                </div>

                <div className="input-group">
                    <FaLock className="input-icon"/>
                    <input type="password" placeholder="Enter your password..."/>
                </div>

                <small className="hint">Must be at least 8 characters.</small>

                <button className="login-btn">Log in</button>

                <div className="or">OR CONNECT WITH</div>

                <div className="socials">
                    <button className="social-btn">Google</button>
                    <button className="social-btn">Facebook</button>
                </div>

                <p className="Signup-link">
                    Don't have an account? <span  onClick={() => navigate("/signin")}>Sign up</span>
                </p>

            </div>


            {/* RIGHT SIDE */}
            <div className="right">

                <div className="big-circle">

                    <div className="circle-content">

                        <h1>Stockflow</h1>

                        <p className="circle-text">
                            Dive into StockFlow and experience the easiest way to manage your inventory, track your stock in real-time, and make smarter decisions that grow your business effortlessly.                        </p>
                        <div className="circle-icons">
                            <FaBox className="icon-feature"/>
                            <FaChartBar className="icon-feature"/>
                            <FaBolt className="icon-feature"/>
                            <FaMobileAlt className="icon-feature"/>
                        </div>
                        <button className="play">▶ Play Demo</button>

                    </div>

                </div>

            </div>

        </div>
    );
}