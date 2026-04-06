import React, { useState, useEffect } from "react";
import "./ProcurementManager.css";
import {
    FaBell,
    FaChartBar,
    FaFolder,
    FaCog,
    FaUser,
    FaSignOutAlt,
    FaBoxes, FaUserTie, FaInbox
} from "react-icons/fa";
import {FiGrid, FiTrendingUp} from "react-icons/fi";
import axios from "axios";
import PurchaseBudgetTracker from "./PurchaseBudgetTracker";
import OrderWizard from "./OrderWizard";

export default function ProcurementManager() {

    const [activeSection, setActiveSection] = useState("dashboard");
    const [profile, setProfile] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:8888/usersservice/v1/user-profiles/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(res.data);

                setProfile(res.data);

            } catch (err) {
                console.error("Error loading profile", err);
            }

        };

        fetchProfile();

    }, []);

    const [pendingFournisseurs, setPendingFournisseurs] = useState([]);

    const updateNotificationStatus = async (notificationId, status, userId) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8888/service-notification/api/notifications/${notificationId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await axios.patch(
                `http://localhost:8888/security-stock/v1/users/${userId}/status`,
                {
                    active: status === "validated"
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Status mis à jour ✅");

            setPendingFournisseurs(prev => {
                const newList = prev.filter(f => f._id !== notificationId);
                setNotificationCount(newList.length);
                return newList;
            });

        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Erreur update fournisseur");
        }
    };

    const validateFournisseur = (id) => updateNotificationStatus(id, "validated");
    const rejectFournisseur = (id) => updateNotificationStatus(id, "rejected");
    const [validatedFournisseurs, setValidatedFournisseurs] = useState([]);
    useEffect(() => {
        const fetchPending = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8888/service-notification/api/notifications/pending", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPendingFournisseurs(res.data);
                setNotificationCount(res.data.length);
            } catch (err) {
                console.error("Erreur fetching pending fournisseurs", err);
            }
        };

        const fetchValidated = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8888/service-notification/api/notifications/validated", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Erreur fetch validated");
                const data = await res.json();
                const arrayData = Array.isArray(data) ? data : data.fournisseurs || [];
                setValidatedFournisseurs(arrayData);
            } catch (err) {
                console.error("Error fetching validated fournisseurs:", err);
                setValidatedFournisseurs([]);
            }
        };

        fetchPending();
        fetchValidated();
    }, []);

    useEffect(() => {
        const fetchAllNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const resPending = await axios.get("http://localhost:8888/service-notification/api/notifications/pending", config);

                const resRestock = await axios.get("http://localhost:8888/service-notification/api/notifications/replenishment-requests", config);

                setNotificationCount(resPending.data.length + resRestock.data.length);

                setPendingFournisseurs(resPending.data);
                setReplenishmentRequests(resRestock.data);

            } catch (err) {
                console.error("Error fetching all notifications:", err);
            }
        };

        fetchAllNotifications();
    }, [activeSection]);
    const downloadCV = async (cvFile) => {
        try {
            if (!cvFile) {
                alert("CV not available");
                return;
            }

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:8888/security-stock/v1/users/download/${cvFile}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob"
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", cvFile);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (err) {
            console.error("Error downloading CV:", err.response || err.message);
            alert("Failed to download CV. Make sure you are logged in.");
        }
    };
    const [replenishmentRequests, setReplenishmentRequests] = useState([]);
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8888/service-notification/api/notifications/replenishment-requests", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReplenishmentRequests(res.data);
            } catch (err) {
                console.error("Error fetching replenishment requests:", err);
            }
        };

        if (activeSection === "restock_orders" || activeSection === "dashboard") {
            fetchRequests();
        }
    }, [activeSection]);

    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    return (
        <div className="manager-container">

            {/* Sidebar */}
            <aside className="sidebar">

                <ul className="menu">

                    <li className={activeSection === "dashboard" ? "active" : ""}
                        onClick={() => setActiveSection("dashboard")}>
                        <FiGrid/>
                    </li>

                    <li className={activeSection === "products" ? "active" : ""}
                        onClick={() => setActiveSection("products")}>
                        <FaBoxes/>
                    </li>
                    <li className={activeSection === "fournisseurs" ? "active" : ""}
                        onClick={() => setActiveSection("fournisseurs")}>
                        <FaUserTie/>
                    </li>

                    <li className={activeSection === "analytics" ? "active" : ""}
                        onClick={() => setActiveSection("analytics")}>
                        <FaChartBar/>
                    </li>
                    <li className={activeSection === "restock_orders" ? "active" : ""}
                        onClick={() => setActiveSection("restock_orders")}>
                        <FaInbox/>
                    </li>
                    <li className={activeSection === "budget" ? "active" : ""}
                        onClick={() => setActiveSection("budget")}>
                        <FiTrendingUp/>
                    </li>
                </ul>

                <ul className="bottom-menu">

                    <li className={activeSection === "settings" ? "active" : ""}
                        onClick={() => setActiveSection("settings")}>
                    <FaCog/>
                    </li>

                    <li onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}>
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

                        <div>
                            <ul className="menu">
                                <li className={activeSection === "bell" ? "active" : ""}
                                    onClick={() => setActiveSection("bell")}>
                                    <FaBell/>
                                </li>
                            </ul>
                            {notificationCount > 0 && <span className="badge-number">{notificationCount}</span>}
                        </div>

                        <div className="nav-avatar"
                             onClick={() => setActiveSection("profile")}
                             style={{cursor: "pointer"}}>
                            {profile?.image ? (
                                <img src={profile.image} alt="avatar" className="nav-avatar-img"/>
                            ) : (
                                <FaUser size={24}/>
                            )}
                        </div>

                        <p>{profile?.prenom || ""}</p>

                    </div>

                </div>

                {activeSection === "budget" && <PurchaseBudgetTracker />}
                {activeSection === "bell" && (
                    <div className="notifications-hub fade-in">
                        <div className="hub-header">
                            <div>
                                <h2 className="section-title">Notification Center</h2>
                                <p className="section-subtitle">Manage your inventory alerts and supplier requests.</p>
                            </div>
                        </div>

                        <div className="notif-sections-container">

                            <section className="notif-group glass-panel">
                                <div className="group-header">
                                    <FaInbox className="icon-stock" style={{ color: '#FFB347' }} />
                                    <h3>Replenishment Requests</h3>
                                    <span className="badge-count" style={{ background: '#FFB347' }}>
                        {replenishmentRequests.length}
                    </span>
                                </div>

                                <div className="notif-list">
                                    {replenishmentRequests.length > 0 ? (
                                        replenishmentRequests.map(req => (
                                            <div key={req._id} className="notif-item critical" onClick={() => setActiveSection("restock_orders")}>
                                                <div className="notif-content">
                                                    <p><strong>{req.productName}</strong>: New restock request for {req.requestedQty} units.</p>
                                                    <span className="notif-time">
                                        From: {req.fromManager} • {new Date(req.dateAlerte).toLocaleString()}
                                    </span>
                                                </div>
                                                <div className="notif-action-icon">→</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-msg">
                                            <p>✅ No pending restock requests.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="notif-group glass-panel">
                                <div className="group-header">
                                    <FaUserTie className="icon-msg" style={{ color: '#4facfe' }} />
                                    <h3>Supplier Registrations</h3>
                                    <span className="badge-count" style={{ background: '#4facfe' }}>
                        {pendingFournisseurs.length}
                    </span>
                                </div>
                                <div className="notif-list">
                                    {pendingFournisseurs.length > 0 ? (
                                        pendingFournisseurs.map(f => (
                                            <div key={f._id} className="notif-item info" onClick={() => setActiveSection("fournisseurs")}>
                                                <div className="notif-content">
                                                    <p><strong>{f.firstName} {f.lastName}</strong> applied as a new supplier.</p>
                                                    <span className="notif-time">
                                        Status: Pending Verification • {new Date(f.dateAlerte).toLocaleDateString()}
                                    </span>
                                                </div>
                                                <div className="notif-action-icon">→</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-msg">
                                            <p>No new supplier applications.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                        </div>
                    </div>
                )}

                {/* Dashboard */}
                {activeSection === "dashboard" && (
                    <>
                        <header className="header">
                            <h1>Manager Dashboard</h1>
                            <p className="subtitle">
                                Monitor inventory performance and stock status.
                            </p>
                        </header>

                        <section className="cards">

                            <div className="card">
                                <div className="card-icon"><FaBoxes/></div>
                                <h3>1,248</h3>
                                <p>Total Products</p>
                            </div>

                            <div className="card">
                                <div className="card-icon"><FaChartBar/></div>
                                <h3>82</h3>
                                <p>Low Stock</p>
                            </div>

                            <div className="card">
                                <div className="card-icon"><FaFolder/></div>
                                <h3>36</h3>
                                <p>Categories</p>
                            </div>

                            <div className="card" onClick={() => setActiveSection("restock_orders")}
                                 style={{cursor: 'pointer'}}>
                                <div className="card-icon"><FaInbox /></div>
                                <h3>{replenishmentRequests.length}</h3>
                                <p>New Restock Requests</p>
                            </div>

                        </section>
                    </>
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

                {activeSection === "restock_orders" && (
                    <div className="panel large restock-panel">
                        <header className="panel-header-custom">
                            <div className="header-info">
                                <div>
                                    <h2>Critical Replenishment Requests</h2>
                                    <p>High-priority restock orders from Inventory Managers</p>
                                </div>
                            </div>
                            <div className="header-stats">
                                <span className="request-count">{replenishmentRequests.length} Pending</span>
                            </div>
                        </header>

                        <div className="table-container-custom">
                            <table className="modern-table">
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Requested Qty</th>
                                    <th>Requested By</th>
                                    <th>Date</th>
                                    <th style={{textAlign: 'center'}}>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {replenishmentRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="empty-row">
                                            <FaInbox size={30} />
                                            <p>No pending requests at the moment</p>
                                        </td>
                                    </tr>
                                ) : (
                                    replenishmentRequests.map((req) => (
                                        <tr key={req._id} className="row-hover">
                                            <td>
                                                <div className="product-cell">
                                                    <span className="p-dot"></span>
                                                    <strong>{req.productName}</strong>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="category-cell">
                                                    <span className="c-tag">
                                                        {req.category || "General"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="qty-pill">{req.requestedQty} units</span>
                                            </td>
                                            <td>
                                                <div className="manager-cell">
                                                    <FaUserTie size={12}/>
                                                    <span>{req.fromManager}</span>
                                                </div>
                                            </td>
                                            <td className="date-cell">
                                                {new Date(req.dateAlerte || Date.now()).toLocaleDateString()}
                                            </td>
                                            <td style={{textAlign: 'center'}}>
                                                <button
                                                    className="btn-approve-modern"
                                                    onClick={() => {
                                                        console.log("Request selected:", req);
                                                        setCurrentRequest(req);
                                                        setIsWizardOpen(true);
                                                    }}
                                                >
                                                    Approve & Order
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* ... بقية الكود ديالك ... */}

                <OrderWizard
                    isOpen={isWizardOpen}
                    onClose={() => setIsWizardOpen(false)}
                    selectedRequest={currentRequest}
                    onSuccess={(id) => {
                        setReplenishmentRequests(prev => prev.filter(r => r._id !== id));
                        alert("Commande traitée avec succès !");
                    }}
                />
                {/* Analytics */}
                {activeSection === "analytics" && (
                    <div className="panel large">

                        <h3>Stock Analytics</h3>

                        <ul className="bars">

                            <li>
                                <span>Stock Growth</span>
                                <div className="bar">
                                    <div style={{width:"75%"}}/>
                                </div>
                            </li>

                            <li>
                                <span>Sales Performance</span>
                                <div className="bar">
                                    <div style={{width:"60%"}}/>
                                </div>
                            </li>

                        </ul>

                    </div>
                )}

                {/* Settings */}
                {activeSection === "settings" && (
                    <div className="panel large">
                        <h3>Manager Settings</h3>
                        <p>Configure inventory preferences and system options.</p>
                    </div>
                )}

                {activeSection === "profile" && (
                    <div className="profile-panel">
                        <h3>Personal Information</h3>

                        <div className="profile-intro">
                            The Procurement Manager supervises inventory, products, and analytics. Responsibilities
                            include monitoring stock levels, tracking performance, and coordinating with staff for
                            efficient workflow.
                        </div>

                        <div className="profile-avatar-section">
                            <div className="avatar-container">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="avatar-input"
                                    onChange={async e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = async () => {
                                                const imageBase64 = reader.result; // hna base64
                                                setProfile({...profile, image: imageBase64});

                                                try {
                                                    const token = localStorage.getItem("token");
                                                    await axios.put(
                                                        `http://localhost:8888/usersservice/v1/user-profiles/me`,
                                                        {image: imageBase64},
                                                        {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        }
                                                    );
                                                    console.log("Image updated!");
                                                } catch (err) {
                                                    console.error("Error updating image", err);
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                {profile?.image ? (
                                    <img src={profile.image} alt="Profile" className="profile-avatar-img"/>
                                ) : (
                                    <FaUser size={90} className="profile-avatar-icon"/>
                                )}
                            </div>
                            <h2 className="upload-text">{profile?.prenom || ""} {profile?.nom || ""}</h2>
                        </div>

                        {/* Inputs row */}
                        <div className="profile-info-two-columns">
                            <div className="form-group"><label>First Name</label><input type="text"
                                                                                        value={profile?.nom || ""}
                                                                                        readOnly/></div>
                            <div className="form-group"><label>Last Name</label><input type="text"
                                                                                       value={profile?.prenom || ""}
                                                                                       readOnly/></div>
                        </div>

                        <div className="profile-info-two-columns">
                            <div className="form-group"><label>Email</label><input type="email"
                                                                                   value={profile?.email || ""}
                                                                                   readOnly/></div>
                            <div className="form-group"><label>Phone</label><input
                                type="text"
                                value={profile?.phone || ""}
                                onChange={e => setProfile({...profile, phone: e.target.value})}
                            /></div>
                        </div>

                        <div className="profile-info-two-columns">
                            <div className="form-group"><label>CIN</label><input
                                type="text"
                                value={profile?.cin || ""}
                                onChange={e => setProfile({...profile, cin: e.target.value})}
                            />
                            </div>
                            <div className="form-group"><label>Status</label><input type="text"
                                                                                    value={profile?.status || ""}
                                                                                    readOnly/></div>
                        </div>

                        <div className="profile-info-two-columns">
                            <div className="form-group"><label>Role</label><input type="text"
                                                                                  value={profile?.metierRole || "Procurement Manager"}
                                                                                  readOnly/></div>
                            <div className="form-group"><label>Join Date</label><input type="text"
                                                                                       value={profile?.createdAt || " "}
                                                                                       readOnly/></div>
                        </div>

                        <div className="profile-actions">
                            <button
                                className="change-btn"
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("token");

                                        // hna ghi les fields editable
                                        const updatedData = {
                                            phone: profile?.phone,
                                            cin: profile?.cin,
                                        };

                                        const res = await axios.put(
                                            `http://localhost:8888/usersservice/v1/user-profiles/me`,
                                            updatedData,
                                            {
                                                headers: {Authorization: `Bearer ${token}`},
                                            }
                                        );

                                        setProfile(res.data); // update local state
                                        alert("Profile updated successfully ✅");
                                    } catch (err) {
                                        console.error("Error updating profile", err.response || err.message);
                                        alert("Failed to update profile.");
                                    }
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {activeSection === "fournisseurs" && (
                    <>
                        <header className="header">
                            <h1>Pending Suppliers</h1>
                            <p className="subtitle">
                                Approve or reject the new suppliers.
                            </p>
                        </header>

                        <section className="panel large">

                            {pendingFournisseurs.length === 0 ? (
                                <p className="empty-msg">No suppliers waiting.</p>
                            ) : (

                                <table className="stock-table users-table">

                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Cin</th>
                                        <th>Date</th>
                                        <th>Role</th>
                                        <th>CV</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {pendingFournisseurs.map((f) => (
                                        <tr key={f._id}>

                                            <td>{f.firstName} {f.lastName}</td>
                                            <td>{f.email}</td>
                                            <td>{f.phone}</td>
                                            <td>{f.cin}</td>
                                            <td>{f.role}</td>
                                            <td>{new Date(f.dateAlerte).toLocaleDateString()}</td>
                                            <td>
                                                {f.cvFile ? (
                                                    <button
                                                        onClick={() => downloadCV(f.cvFile.replace(/^\/?uploads\/cv\//, ''))}>
                                                        Download CV
                                                    </button>
                                                ) : "N/A"}
                                            </td>

                                            <td className="actions">

                                                <button
                                                    className="btn-validate"
                                                    onClick={() =>
                                                        updateNotificationStatus(
                                                            f._id,
                                                            "validated",
                                                            f.userId
                                                        )
                                                    }
                                                >
                                                    Validate
                                                </button>

                                                <button
                                                    className="btn-reject"
                                                    onClick={() => rejectFournisseur(f._id)}
                                                >
                                                    Refuse
                                                </button>

                                            </td>

                                        </tr>
                                    ))}
                                    </tbody>

                                </table>
                            )}

                        </section>

                        <header className="header">
                            <h1>Pending Suppliers</h1>
                            <p className="subtitle">
                                Approve or reject the new suppliers.
                            </p>
                        </header>

                        <section className="panel large">

                            {validatedFournisseurs.length === 0 ? <p>No validated suppliers</p> : (
                                <table className="stock-table users-table">
                                    <thead>
                                    <tr>
                                        <th>Name</th><th>Email</th><th>Phone</th><th>CIN</th><th>Date</th><th>CV</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {validatedFournisseurs.map(f => (
                                        <tr key={f._id || f.id}>
                                            <td>{f.firstName} {f.lastName}</td>
                                            <td>{f.email}</td>
                                            <td>{f.phone}</td>
                                            <td>{f.cin}</td>
                                            <td>{new Date(f.dateAlerte).toLocaleDateString()}</td>
                                            <td>{f.cvFile ? <button onClick={() => downloadCV(f.cvFile.replace(/^\/?uploads\/cv\//, ''))}>Download CV</button> : "N/A"}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}

                        </section>
                    </>
                )}
            </main>

        </div>
    );
}