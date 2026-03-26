import React, { useState, useEffect, ChangeEvent } from "react";
import "./fournisseur.css";
import {
    FaBell,
    FaChartBar,
    FaFolder,
    FaCog,
    FaUser,
    FaSignOutAlt,
    FaBoxes,
    FaUserTie
} from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import axios from "axios";

interface Profile {
    userId?: number;
    nom?: string;
    prenom?: string;
    phone?: string;
    email?: string;
    cin?: string;
    status?: string;
    metierRole?: string;
    createdAt?: string;
    image?: string | null;
}
interface FournisseurResponse {
    message: string;
    fournisseur: Profile;
}
export default function Fournisseur() {
    const [activeSection, setActiveSection] = useState<string>("dashboard");
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get<FournisseurResponse>(
                    "http://localhost:5000/api/fournisseurs/me",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                console.log("API RESPONSE =>", res.data);
                setProfile(res.data.fournisseur);

            } catch (err: any) {
                console.error("ERROR =>", err.response?.data || err.message);
            }
        };

        fetchProfile();
    }, []);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const token = localStorage.getItem("token");

        try {
            const res = await axios.put(
                "http://localhost:5000/api/fournisseurs/me",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            // Update profile with full URL
            const updatedProfile = res.data.fournisseur;
            if (updatedProfile.image && !updatedProfile.image.startsWith("http")) {
                updatedProfile.image = `http://localhost:5000${updatedProfile.image}`;
            }
            setProfile(updatedProfile);

        } catch (err) {
            console.error("Error updating image", err);
        }
    };

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="manager-container">

            {/* Sidebar */}
            <aside className="sidebar">
                <ul className="menu">
                    <li className={activeSection === "dashboard" ? "active" : ""} onClick={() => setActiveSection("dashboard")}>
                        <FiGrid/>
                    </li>
                    <li className={activeSection === "products" ? "active" : ""} onClick={() => setActiveSection("products")}>
                        <FaBoxes/>
                    </li>
                    <li className={activeSection === "analytics" ? "active" : ""} onClick={() => setActiveSection("analytics")}>
                        <FaChartBar/>
                    </li>
                </ul>

                <ul className="bottom-menu">
                    <li className={activeSection === "settings" ? "active" : ""} onClick={() => setActiveSection("settings")}>
                        <FaCog/>
                    </li>
                    <li onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}>
                        <FaSignOutAlt/>
                    </li>
                </ul>
            </aside>

            {/* Main */}
            <main className="main">

                {/* Navbar */}
                <div className="top-nav">
                    <a href="/" className="nav-logo">
                        <span className="logo-box">GO</span>
                        <img src="/images/logoostock.jpeg" alt="logo" className="logo-image"/>
                    </a>

                    <div className="nav-right">
                        <div className="nav-avatar small">
                            <FaBell/>
                            <span className="badge-number">2</span>
                        </div>

                        <div className="nav-avatar" onClick={() => setActiveSection("profile")} style={{cursor:"pointer"}}>
                            {profile?.image ? <img
                                src={profile.image.startsWith('http') ? profile.image : `http://localhost:5000${profile.image}`}
                                alt="Profile"
                                className="nav-avatar-img"
                            /> : <FaUser size={24}/>}
                        </div>

                        <p>{profile?.prenom || ""}</p>
                    </div>
                </div>

                {/* Dashboard */}
                {activeSection === "dashboard" && (
                    <div className="panel large">
                        <h3>Fournisseur Dashboard</h3>
                        <p>Monitor your supply and orders.</p>
                    </div>
                )}

                {/* Products */}
                {activeSection === "products" && (
                    <div className="panel large">
                        <h3>Products List</h3>
                        <table className="stock-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Laptop Dell</td>
                                <td>Electronics</td>
                                <td>45</td>
                                <td>Available</td>
                            </tr>
                            <tr>
                                <td>Keyboard</td>
                                <td>Accessories</td>
                                <td>12</td>
                                <td>Low</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Analytics */}
                {activeSection === "analytics" && (
                    <div className="panel large">
                        <h3>Stock Analytics</h3>
                        <ul className="bars">
                            <li><span>Stock Growth</span><div className="bar"><div style={{width:"75%"}}/></div></li>
                            <li><span>Sales Performance</span><div className="bar"><div style={{width:"60%"}}/></div></li>
                        </ul>
                    </div>
                )}

                {/* Settings */}
                {activeSection === "settings" && (
                    <div className="panel large">
                        <h3>Settings</h3>
                        <p>Configure preferences and account options.</p>
                    </div>
                )}

                {/* Profile */}
                {activeSection === "profile" && profile && (
                    <div className="profile-panel">
                        <h3>Personal Information</h3>

                        {/* Avatar */}
                        <div className="profile-avatar-section">
                            <div className="avatar-container">
                                <input type="file" accept="image/*" className="avatar-input"
                                       onChange={handleImageChange}/>

                                {profile.image ? (
                                    <img
                                        src={profile.image.startsWith('http') ? profile.image : `http://localhost:5000${profile.image}`}
                                        alt="Profile"
                                        className="profile-avatar-img"
                                    />
                                ) : (
                                    <FaUser size={90} className="profile-avatar-icon"/>
                                )}
                            </div>

                            <h2 className="upload-text">
                                {profile.prenom || ""} {profile.nom || ""}
                            </h2>
                        </div>

                        {/* Infos */}
                        <div className="profile-info-two-columns">

                            <div className="form-group">
                                <label>First Name</label>
                                <input value={profile.prenom || ""} readOnly/>
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input value={profile.nom || ""} readOnly/>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input value={profile.email || ""} readOnly/>
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input value={profile.phone || ""} readOnly/>
                            </div>

                            <div className="form-group">
                                <label>Cin</label>
                                <input value={profile.cin || ""} readOnly/>
                            </div>

                            <div className="form-group">
                                <label>Status</label>
                                <input value={profile.status || "VALIDATED"} readOnly/>
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <input value={"Fournisseur"} readOnly/>
                            </div>

                            <div className="form-group">
                                <label>Join Date</label>
                                <input
                                    value={
                                        profile.createdAt
                                            ? new Date(profile.createdAt).toLocaleDateString()
                                            : ""
                                    }
                                    readOnly
                                />
                            </div>

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}