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
    FaUserTie,
    FaTags,
    FaTasks
} from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
const OrderItemCard = ({ order }: { order: any }) => {
    const [decision, setDecision] = useState<"pending" | "accepted" | "refused">("pending");
    const [reason, setReason] = useState("");
    const [price, setPrice] = useState("");

    return (
        <motion.div layout className={`order-stepper-card ${decision}`}>
            <div className="order-main-info">

                <h3>{order.pName || "Product Request"}</h3>
                <p className="manager-note">Note: {order.message}</p>
            </div>

            <div className="decision-bar">
                <button
                    className={`btn-choice accept ${decision === 'accepted' ? 'active' : ''}`}
                    onClick={() => setDecision("accepted")}
                >
                    ✔ I have the stock
                </button>
                <button
                    className={`btn-choice refuse ${decision === 'refused' ? 'active' : ''}`}
                    onClick={() => setDecision("refused")}
                >
                    ✖ Out of stock
                </button>
            </div>

            <AnimatePresence mode="wait">
                {decision === "refused" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="action-sub-panel refuse-panel">
                        <textarea
                            placeholder="Why? (e.g. Stock finished)"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <button className="btn-send-refusal" onClick={() => alert("Refusal sent")}>Send Refusal</button>
                    </motion.div>
                )}

                {decision === "accepted" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="action-sub-panel accept-panel">
                        <div className="price-reveal-group">
                            <input
                                type="number"
                                placeholder="Price (DH)"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <button className="btn-final-submit" onClick={() => alert(`Quote: ${price} DH sent`)}>
                                Submit Quote
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
export default function Fournisseur() {
    const [activeSection, setActiveSection] = useState<string>("dashboard");
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get<FournisseurResponse>(
                    "http://localhost:8888/service-fournisseur/api/fournisseurs/me",
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
                "http://localhost:8888/service-fournisseur/api/fournisseurs/me",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            const updatedProfile = res.data.fournisseur;
            setProfile(res.data.fournisseur);
            setProfile(updatedProfile);

        } catch (err) {
            console.error("Error updating image", err);
        }
    };

    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCats, setSelectedCats] = useState<number[]>([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8888/produit-stock-service/v1/categories", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };
        fetchCategories();
    }, []);

    const toggleCategory = (id: number) => {
        setSelectedCats(prev =>
            prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
        );
    };

    const saveSpecialization = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:8888/service-fournisseur/api/fournisseurs/specializations",
                { categoryIds: selectedCats },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.status === 200) {
                alert("Your specializations have been successfully registered ✅");
            }
        } catch (err: any) {
            console.error("Error saving specializations", err.response?.data || err.message);
            alert("Error saving specializations.");
        }
    };

    const [allNotifications, setAllNotifications] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8888/service-notification/api/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = res.data.notifications || res.data;

            console.log("RAW DATA FROM API:", res.data);
            setAllNotifications(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Error fetching notifications", err);
            setAllNotifications([]);
        }
    };

    useEffect(() => {
        if (activeSection === "bell") {
            fetchNotifications();
        }
    }, [activeSection]);

    const orderRequests = allNotifications.filter(n => n.niveau === "RFQ");

    const handleMarkAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://localhost:8888/service-notification/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications(); // Refresh
        } catch (err) {
            console.error("Error marking as read", err);
        }
    };
    if (!profile) return <p>Loading profile...</p>;
    return (
        <div className="manager-container">

            {/* Sidebar */}
            <aside className="sidebar">
                <ul className="menu">
                    <li className={activeSection === "dashboard" ? "active" : ""}
                        onClick={() => setActiveSection("dashboard")}>
                        <FiGrid/>
                    </li>
                    <li className={activeSection === "orders" ? "active" : ""}
                        onClick={() => setActiveSection("orders")}>
                        <FaTasks/>
                    </li>
                    <li className={activeSection === "analytics" ? "active" : ""}
                        onClick={() => setActiveSection("analytics")}>
                        <FaChartBar/>
                    </li>
                    <li className={activeSection === "specialization" ? "active" : ""}
                        onClick={() => setActiveSection("specialization")}>
                        <FaTags/>
                    </li>
                </ul>

                <ul className="bottom-menu">
                    <li className={activeSection === "settings" ? "active" : ""}
                        onClick={() => setActiveSection("settings")}>
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
                        <div>
                            <ul className="menu">
                                <li className={activeSection === "bell" ? "active" : ""}
                                    onClick={() => setActiveSection("bell")}>
                                    <FaBell/>
                                </li>
                            </ul>
                        </div>

                        <div className="nav-avatar" onClick={() => setActiveSection("profile")}
                             style={{cursor: "pointer"}}>
                            {profile?.image ?
                                <img
                                    src={profile.image.startsWith('http')
                                        ? profile.image
                                        : `http://localhost:8888/service-fournisseur${profile.image}`}
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

                {activeSection === "bell" && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="notifications-hub"
                    >
                        <div className="hub-header">
                            <div className="header-text-group">
                                <h2 className="section-title">Notification Center</h2>
                                <p className="section-subtitle">Manage your inventory alerts, orders, and system communications.</p>
                            </div>
                        </div>

                        <div className="notif-sections-container">

                            {/* --- COLUMN 1: NEW ORDER REQUESTS (الجديد) --- */}
                            <section className="notif-group glass-panel">
                                <div className="group-header">
                                    <FaTags className="icon-order" style={{ color: '#6c5ce7' }} />
                                    <h3>New Order Requests</h3>
                                    <span className="badge-count" style={{ background: '#6c5ce7' }}>
                        {orderRequests.length}
                    </span>
                                </div>
                                <div className="notif-list">
                                    {orderRequests.length > 0 ? (
                                        orderRequests.map(notif => (
                                            <div key={notif._id} className="notif-item order-request">
                                                <div className="notif-content">
                                                    <p>{notif.message}</p>
                                                    <span
                                                        className="notif-time">{new Date(notif.dateAlerte).toLocaleString()}</span>
                                                </div>
                                                <button
                                                    className="btn-action-quote"
                                                    onClick={() => {
                                                        setActiveSection("orders");
                                                    }}
                                                >
                                                    Set Price <span className="arrow-icon">→</span>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-msg"><p>No pending orders.</p></div>
                                    )}
                                </div>
                            </section>

                            {/* --- COLUMN 2: CRITICAL STOCK ALERTS --- */}
                            <section className="notif-group glass-panel">
                                <div className="group-header">
                                    <FaBoxes className="icon-stock" style={{ color: '#ef4444' }} />
                                    <h3>Stock Alerts</h3>
                                    <span className="badge-count" style={{ background: '#ef4444' }}>
                                    </span>
                                </div>
                            </section>

                            {/* --- COLUMN 3: SYSTEM MESSAGES --- */}
                            <section className="notif-group glass-panel">
                                <div className="group-header">
                                    <FaBell className="icon-msg" style={{ color: '#4facfe' }} />
                                    <h3>System Messages</h3>
                                    <span className="badge-count" style={{ background: '#4facfe' }}>
                                    </span>
                                </div>
                            </section>

                        </div>
                    </motion.div>
                )}
                {activeSection === "specialization" && (
                    <div className="specialization-panel fade-in">
                        <header className="spec-header">
                            <h2>My Specializations</h2>
                            <p>Choose the product categories you can supply.</p>
                        </header>

                        <div className="categories-grid">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={`category-card ${selectedCats.includes(cat.id) ? 'selected' : ''}`}
                                    onClick={() => toggleCategory(cat.id)}
                                >
                                    <div className="card-check">
                                        {selectedCats.includes(cat.id) ? '✓' : '+'}
                                    </div>
                                    <div className="card-content">
                                        <h4>{cat.nom}</h4>
                                        <p>{cat.description || "Supplier of products in this category"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="action-bar">
                            <button className="btn-save-spec" onClick={saveSpecialization}>
                                Save my choices
                            </button>
                        </div>
                    </div>
                )}

                {/* Orders */}
                {activeSection === "orders" && (
                    <div className="orders-workspace">
                        <header className="workspace-header">
                            <div className="header-with-badge">
                                <h2>Order Decision Center</h2>

                                <span className="total-orders-badge">
                    {orderRequests.length} Pending Requests
                </span>
                            </div>
                            <p>Validate availability and submit pricing for each request below.</p>
                        </header>

                        <div className="orders-container">
                            {orderRequests.length > 0 ? (
                                orderRequests.map((order) => (
                                    <OrderItemCard key={order._id} order={order} />
                                ))
                            ) : (
                                <div className="empty-msg">
                                    <p>No pending orders to show at the moment.</p>
                                </div>
                            )}
                        </div>
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
                                        src={profile.image.startsWith('http')
                                            ? profile.image
                                            : `http://localhost:8888/service-fournisseur${profile.image}`}
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