
import React, { useState, useEffect, ChangeEvent } from "react";
import "./InventoryManager.css";
import {
    FaBell,
    FaChartBar,
    FaFolder,
    FaCog,
    FaUser,
    FaSignOutAlt,
    FaBoxes
} from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import axios from "axios";
import CreateProduitForm from "./CreateProduitForm";
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

export default function InventoryManager() {
    const [activeSection, setActiveSection] = useState<string>("dashboard");
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get<Profile>(
                    "http://localhost:8060/v1/user-profiles/me",
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

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const imageBase64 = reader.result as string;
                setProfile(prev => prev ? {...prev, image: imageBase64} : null);

                try {
                    const token = localStorage.getItem("token");
                    await axios.put(
                        `http://localhost:8060/v1/user-profiles/me`,
                        { image: imageBase64 },
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
    };

    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8062/v1/produits", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    useEffect(() => {
        if (activeSection === "products") {
            fetchProducts();
        }
    }, [activeSection]);
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

                    <li className={activeSection === "analytics" ? "active" : ""}
                        onClick={() => setActiveSection("analytics")}>
                        <FaChartBar/>
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
                        </section>
                    </>
                )}

                {/* Products Section */}
                {activeSection === "products" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="products-hub"
                    >
                        <div className="hub-header">
                            <div>
                                <h2 className="section-title">Inventory Repository</h2>
                                <p className="section-subtitle">Manage, track and deploy new product assets.</p>
                            </div>

                            <button
                                className="btn-add-product-main"
                                onClick={() => setActiveSection("create-product")}
                            >
                                <FaBoxes style={{marginRight: '10px'}}/>
                                Deploy New Asset
                            </button>
                        </div>

                        <div className="panel large glass-panel">
                            <div className="panel-header-inline">
                                <h3>Active Inventory</h3>
                                <div className="table-search">
                                    <input
                                        type="text"
                                        placeholder="Search by SKU or Name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <table className="stock-table">
                                <thead>
                                <tr>
                                    <th>Product Info</th>
                                    <th>Category</th>
                                    <th>Stock Level</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products
                                    .filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="td-info"
                                                     style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                    {product.image && <img src={product.image} alt="p"/>}
                                                    <div>
                                                        <strong>{product.nom}</strong>
                                                        <span>SKU: {product.sku}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge-cat">
                                                    {product.category ? product.category.nom : (product.categorie || "No Category")}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="stock-progress">
                                                    <span>{product.quantiteDisponible ?? 0} units</span>

                                                    <div className="mini-bar">
                                                        <div style={{
                                                            width: product.quantiteDisponible > (product.seuilCritique || 5) ? '80%' : '20%',
                                                            backgroundColor: product.quantiteDisponible > (product.seuilCritique || 5) ? '#4facfe' : '#ef4444'
                                                        }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`status-pill ${product.active ? 'available' : 'out-of-stock'}`}>
                                                    {product.active ? "Active" : "Disabled"}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn-edit-small">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeSection === "create-product" && (
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        className="create-product-wrapper"
                    >
                        <div className="back-nav">
                            <button onClick={() => setActiveSection("products")} className="btn-back">
                                ← Back to Inventory
                            </button>
                        </div>
                        <CreateProduitForm/>
                    </motion.div>
                )}

                {/* Analytics */}
                {activeSection === "analytics" && (
                    <div className="panel large">
                        <h3>Stock Analytics</h3>
                        <ul className="bars">
                            <li>
                                <span>Stock Growth</span>
                                <div className="bar">
                                    <div style={{width: "75%"}}/>
                                </div>
                            </li>
                            <li>
                                <span>Sales Performance</span>
                                <div className="bar">
                                    <div style={{width: "60%"}}/>
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

                {/* Profile */}
                {activeSection === "profile" && (
                    <div className="profile-panel">
                        <h3>Personal Information</h3>

                        <div className="profile-intro">
                            The Inventory Manager oversees stock management, product organization, and warehouse
                            operations. Responsibilities include maintaining accurate inventory levels, analyzing stock
                            trends, and coordinating with the team for smooth operational workflow.
                        </div>

                        <div className="profile-avatar-section">
                            <div className="avatar-container">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="avatar-input"
                                    onChange={handleImageChange}
                                />
                                {profile?.image ? (
                                    <img src={profile.image} alt="Profile" className="profile-avatar-img"/>
                                ) : (
                                    <FaUser size={90} className="profile-avatar-icon"/>
                                )}
                            </div>
                            <h2 className="upload-text">{profile?.prenom || ""} {profile?.nom || ""}</h2>
                        </div>

                        {/* Info */}
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
                            /></div>
                            <div className="form-group"><label>Status</label><input type="text"
                                                                                    value={profile?.status || ""}
                                                                                    readOnly/></div>
                        </div>

                        <div className="profile-info-two-columns">
                            <div className="form-group"><label>Role</label><input type="text"
                                                                                  value={profile?.metierRole || "Inventory Manager"}
                                                                                  readOnly/></div>
                            <div className="form-group"><label>Join Date</label><input type="text"
                                                                                       value={profile?.createdAt || ""}
                                                                                       readOnly/></div>
                        </div>

                        <div className="profile-actions">
                            <button
                                className="change-btn"
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("token");

                                        const updatedData = {
                                            phone: profile?.phone,
                                            cin: profile?.cin,
                                        };

                                        const res = await axios.put(
                                            `http://localhost:8060/v1/user-profiles/me`,
                                            updatedData,
                                            {
                                                headers: {Authorization: `Bearer ${token}`},
                                            }
                                        );

                                        setProfile(res.data);
                                        alert("Profile updated successfully ✅");
                                    } catch (err) {
                                        console.error("Error updating profile");
                                        alert("Failed to update profile.");
                                    }
                                }}
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>
                )}

            </main>
        </div>
    );
}