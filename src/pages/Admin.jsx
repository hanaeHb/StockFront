import React, { useState, useEffect, useRef } from "react";
import "./Admin.css";
import {
    FaBell,
    FaComments,
    FaChartBar,
    FaUserTie,
    FaCog,
    FaUsers,
    FaUser,
    FaSignOutAlt,
    FaEnvelope,
    FaLock,
    FaTrash,
    FaEdit,
    FaPhone,
    FaBoxes,
    FaTruckLoading
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { TbCategory } from "react-icons/tb";
import { HiViewGridAdd } from "react-icons/hi";
import { FaTruck } from "react-icons/fa";
import "./CreateProduitForm";
import { FiGrid, FiCreditCard } from "react-icons/fi";
import UsersRoleChart from "./UsersRoleChart";
import UsersStatusChart from "./UsersStatusChart";
import axios from "axios";
import CreateProduitForm from "./CreateProduitForm";
import {motion} from "framer-motion";



export default function Admin() {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [showForm, setShowForm] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const dropdownRef = useRef(null);
    const [profile, setProfile] = useState(null);
    // ===================== Profile States =====================
    const API_URL = "http://localhost:8098/v1/users";
    const token = localStorage.getItem("token");
    const adminId = 1; // replace with dynamic ID if needed
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        cin: "",
        role: ["Manager"]
    });
    const [formError, setFormError] = useState("");
    const [profileData, setProfileData] = useState({
        metierRole: "Manager"
    });
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const filteredUsers = users.filter(user => !user.roles.includes("Fournisseur"));
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    // ===================== fournisseur pages ===================
    const [currentPageFournisseurs, setCurrentPageFournisseurs] = useState(1);

    const fournisseurs = users.filter(user => user.roles.includes("Fournisseur"));

    const indexOfLastFournisseur = currentPageFournisseurs * usersPerPage;
    const indexOfFirstFournisseur = indexOfLastFournisseur - usersPerPage;
    const currentFournisseurs = fournisseurs.slice(indexOfFirstFournisseur, indexOfLastFournisseur);
    // ===================== Click Outside Dropdown =====================
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // ===================== Fetch Admin Profile =====================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    "http://localhost:8060/v1/user-profiles/me",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                console.log(res.data);
                setProfile(res.data); // b7al ma katb9ach setAdminData?
                setAdminData(res.data); // khas t3ammar state li katb9a kat3ml update
            } catch (err) {
                console.error("Error loading profile", err);
            }
        };
        fetchProfile();
    }, []);

    // ===================== Update Profile =====================
    const handleUpdate = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const updatedData = {
            phone: adminData.phone,
            cin: adminData.cin,
        };
        fetch(`http://localhost:8060/v1/user-profiles/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update admin");
                return res.json();
            })
            .then(data => {
                setAdminData(data); // update state bach UI tban m3a data jdida
                alert("Profile updated successfully");
            })
            .catch(err => alert("Error updating profile: " + err.message));
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:8098/v1/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`Erreur ${res.status}`);
            const data = await res.json();

            setUsers(data);

        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des utilisateurs: " + error.message);
        }
    };

    const createUser = async () => {

        // ✅ Front validation
        if (!isValidEmail(userData.email)) {
            alert("Email invalide ❌");
            return;
        }

        if (!userData.firstName || !userData.lastName || !userData.password) {
            alert("Tous les champs sont obligatoires ❌");
            return;
        }

        try {
            const userRes = await fetch("http://localhost:8098/v1/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });


            const data = await userRes.json();

            if (!userRes.ok) {

                throw new Error(
                    data.message ||
                    data.email ||
                    "Erreur lors de la création ❌"
                );
            }

            alert("User créé avec succès ✅");

            fetchUsers();
            setShowForm(false);

            setUserData({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                phone: "",
                cin: "",
                role: ["Manager"]
            });

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateUser = async () => {
        try {
            const res = await fetch(`${API_URL}/user/${editingUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: editingUser.firstName,
                    lastName: editingUser.lastName,
                    email: editingUser.email,
                    phone: editingUser.phone,
                    cin: editingUser.cin,
                    roles: editingUser.roles
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Erreur lors de la mise à jour");
            }

            const data = await res.json();
            alert("User updated successfully!");
            fetchUsers();
            setEditingUser(null);

        } catch (err) {
            console.error(err);
            alert("Update error: " + err.message);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`http://localhost:8098/v1/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to delete user");

            alert("User deleted successfully!");
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert("Error deleting user: " + error.message);
        }
    }
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await fetch(`http://localhost:8098/v1/users/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    active: !currentStatus
                })
            });

            fetchUsers();

        } catch (error) {
            console.error(error);
            alert("Erreur lors du changement du statut");
        }
    };

    const [pendingFournisseurs, setPendingFournisseurs] = useState([]);
    const [validatedFournisseurs, setValidatedFournisseurs] = useState([]);

    const fetchPendingFournisseurs = async () => {
        try {
            const res = await fetch(
                "http://localhost:5003/api/notifications/pending",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error("Erreur fetch pending");
            const data = await res.json();

            setPendingFournisseurs(Array.isArray(data) ? data : data.fournisseurs || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchValidatedFournisseurs = async () => {
        try {
            const res = await fetch(
                "http://localhost:5003/api/notifications/validated",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error("Erreur fetch validated");
            const fournisseurs5003 = await res.json();
            const fournisseursArray = Array.isArray(fournisseurs5003) ? fournisseurs5003 : fournisseurs5003.fournisseurs || [];

            const resUsers = await fetch(
                "http://localhost:8098/v1/users",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!resUsers.ok) throw new Error("Erreur fetch users");
            const users = await resUsers.json();

            const merged = fournisseursArray.map(f => {
                const user = users.find(u => u.email === f.email);
                return { ...f, active: user?.active || false };
            });

            setValidatedFournisseurs(merged);

        } catch (err) {
            console.error(err);
        }
    };

    const downloadCV = async (cvFile) => {
        try {
            if (!cvFile) {
                alert("CV not available");
                return;
            }

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:8098/v1/users/download/${cvFile}`,
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
    useEffect(() => {
        fetchPendingFournisseurs();
        fetchValidatedFournisseurs();
    }, []);

    // ===================== Category States =====================
    const [categories, setCategories] = useState([]);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [categoryData, setCategoryData] = useState({
        nom: "",
        description: ""
    });

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8062/v1/categories", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };

    // Create Category
    const createCategory = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8062/v1/categories", categoryData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Category created! ✅");
            resetCategoryForm();
            fetchCategories();
        } catch (err) {
            alert("Error during creation ❌");
        }
    };

    // ===================== Category Update States =====================
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);

    const handleEditClick = (cat) => {
        setCategoryData({ nom: cat.nom, description: cat.description });
        setCurrentCategoryId(cat.id);
        setIsEditing(true);
        setShowCategoryForm(true);
    };

    const updateCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8062/v1/categories/${currentCategoryId}`, categoryData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Catégorie mise à jour ! ✅");
            resetCategoryForm();
            fetchCategories();
        } catch (err) {
            alert("Erreur lors de la modification ❌");
        }
    };
    const resetCategoryForm = () => {
        setCategoryData({ nom: "", description: "" });
        setShowCategoryForm(false);
        setIsEditing(false);
        setCurrentCategoryId(null);
    };
    // Delete Category
    const deleteCategory = async (id) => {
        if (!window.confirm("Voulez-vous supprimer cette catégorie ?")) return;
        try {
            await axios.delete(`http://localhost:8062/v1/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (err) {
            alert("Impossible de supprimer : Catégorie liée à des produits ❌");
        }
    };

    useEffect(() => {
        if (activeSection === "categorys") {
            fetchCategories();
        }
    }, [activeSection]);

    const [products, setProducts] = useState([]);
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
        <div className="admin-container">

            {/* ===================== Sidebar ===================== */}
            <aside className="sidebar">
                <ul className="menu">
                    <li className={activeSection === "dashboard" ? "active" : ""}
                        onClick={() => setActiveSection("dashboard")}>
                        <FiGrid/>
                    </li>

                    <li className={activeSection === "suppliers" ? "active" : ""}
                        onClick={() => setActiveSection("suppliers")}>
                        <FaComments/>
                    </li>

                    <li className={activeSection === "analytics" ? "active" : ""}
                        onClick={() => setActiveSection("analytics")}>
                        <FaChartBar/>
                    </li>

                    <li className={activeSection === "fournisseurs" ? "active" : ""}
                        onClick={() => setActiveSection("fournisseurs")}>
                        <FaUserTie/>
                    </li>

                    <li className={activeSection === "users" ? "active" : ""}
                        onClick={() => setActiveSection("users")}>
                        <FaUsers/>
                    </li>
                    <li className={activeSection === "products" ? "active" : ""}
                        onClick={() => setActiveSection("products")}>
                        <FaBoxes/>
                    </li>
                    <li className={activeSection === "categorys" ? "active" : ""}
                        onClick={() => setActiveSection("categorys")}>
                        <HiViewGridAdd/>
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

            {/* ===================== Main Content ===================== */}
            <main className="main">

                {/* ===================== Top Nav ===================== */}
                <div className="top-nav">
                    <a href="/" className="nav-logo">
                        <span className="logo-box">GO</span>
                        <img src="/images/logoostock.jpeg" alt="Stockflow Logo" className="logo-image"/>
                    </a>


                    <div className="nav-right">
                        <div className="nav-badge">
                            <div>
                                <ul className="menu">
                                    <li className={activeSection === "bell" ? "active" : ""}
                                        onClick={() => setActiveSection("bell")}>
                                        <FaBell/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="nav-dropdown" ref={dropdownRef}>
                            <div
                                className="nav-avatar"
                                onClick={() => setActiveSection("profile")}
                            >
                            <FaUser/>
                            </div>
                        </div>
                        <p>{adminData?.prenom}</p>
                    </div>
                </div>

                {/* ===================== Dashboard ===================== */}
                {activeSection === "dashboard" && (
                    <>
                        <header className="header">
                            <h1>Stock & Users Dashboard</h1>
                        </header>

                        <section className="cards">
                            {/* Total Products */}
                            <div className="card">
                                <div className="card-icon"><FiGrid/></div>
                                <h3>1,248</h3>
                                <p>Total Products</p>
                            </div>

                            {/* Low Stock */}
                            <div className="card">
                                <div className="card-icon"><FaChartBar/></div>
                                <h3>82</h3>
                                <p>Low Stock</p>
                            </div>

                            {/* Total Users */}
                            <div className="card">
                                <div className="card-icon"><FaUsers/></div>
                                <h3>{users.filter(user => !user.roles.includes("Fournisseur")).length}</h3>
                                <p>Total Users</p>
                            </div>
                            <div className="card">
                                <div className="card-icon"><FaUserTie/></div>
                                <h3>{users.filter(user => user.roles.includes("Fournisseur")).length}</h3>
                                <p>Total Suppliers</p>
                            </div>

                            {/* Top Role */}
                            <div className="card">
                                <div className="card-icon"><FaCog/></div>
                                <h3>
                                    {(() => {
                                        if (!users.length) return "-";
                                        const roleCount = {};
                                        users.forEach(u => u.roles?.forEach(r => roleCount[r] = (roleCount[r] || 0) + 1));
                                        const topRole = Object.entries(roleCount).sort((a, b) => b[1] - a[1])[0];
                                        return topRole ? `${topRole[0]} (${topRole[1]})` : "-";
                                    })()}
                                </h3>
                                <p>Top Role</p>
                            </div>
                        </section>

                        {/* ===================== Users Charts ===================== */}
                        <div className="charts-row" style={{marginTop: "40px"}}>

                            <section className="role-chart-section">
                                <h3>Users by Role</h3>
                                <div style={{ height: "250px" }}>
                                    <UsersRoleChart users={users} />
                                </div>
                            </section>

                            <section className="role-chart-section">
                                <h3>Users Status</h3>
                                <div style={{ height: "250px" }}>
                                    <UsersStatusChart users={users} />
                                </div>
                            </section>

                        </div>
                    </>
                )}

                {/* ===================== Suppliers ===================== */}
                {activeSection === "suppliers" && (
                    <div className="panel large">
                        <h3>Suppliers</h3>
                        <table className="stock-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Contact</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Ahmed Benali</td>
                                <td>ElectroPro</td>
                                <td>+212 600 000000</td>
                                <td>Active</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ===================== Analytics ===================== */}
                {activeSection === "analytics" && (
                    <div className="panel large">
                        <h3>Analytics Overview</h3>
                        <ul className="bars">
                            <li><span>Monthly Sales</span>
                                <div className="bar">
                                    <div style={{width: "80%"}}/>
                                </div>
                            </li>
                            <li><span>Stock Growth</span>
                                <div className="bar">
                                    <div style={{width: "65%"}}/>
                                </div>
                            </li>
                        </ul>
                    </div>
                )}

                {/* ===================== fournisseurs ===================== */}
                {activeSection === "fournisseurs" && (
                    <div className="panel large">
                        <div className="users-info">
                            <p>
                                Here, you can view the list of suppliers that
                                are pending and validated.
                                You can activate or deactivatevalidated suppliers and
                                easily manage their contact information.
                            </p>
                        </div>

                        {/* ===================== Pending Fournisseurs ===================== */}
                        <div className="pending-suppliers" style={{marginTop: "60px"}}>
                            <h3 style={{textAlign: "center"}}>Pending Suppliers</h3>
                            <p className="texts">
                                Here you can manage all suppliers waiting for approval.
                            </p>
                            <table className="stock-table users-table">
                                <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>CIN</th>
                                    <th>Request Date</th>
                                    <th>CV</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(pendingFournisseurs) && pendingFournisseurs.length > 0 ? (
                                    pendingFournisseurs.map(f => (
                                        <tr key={f._id || f.id}>
                                            <td>{f.firstName}</td>
                                            <td>{f.lastName}</td>
                                            <td>{f.email}</td>
                                            <td>{f.phone}</td>
                                            <td>{f.cin}</td>
                                            <td>{new Date(f.dateAlerte).toLocaleDateString()}</td>
                                            <td>
                                                {f.cvFile ? (
                                                    <button
                                                        onClick={() => downloadCV(f.cvFile.replace(/^\/?uploads\/cv\//, ''))}>
                                                        Download CV
                                                    </button>
                                                ) : "N/A"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No pending suppliers</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* ===================== Validated Fournisseurs ===================== */}
                        <div className="validated-suppliers" style={{marginTop: "60px"}}>
                            <h3 style={{textAlign: "center"}}>Validated Suppliers</h3>
                            <p className="texts">
                                These suppliers are already approved and active.
                            </p>
                            <table className="stock-table users-table">
                                <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>CIN</th>
                                    <th>Validate Date</th>
                                    <th>CV</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(validatedFournisseurs) && validatedFournisseurs.length > 0 ? (
                                    validatedFournisseurs.map(f => (
                                        <tr key={f._id || f.id}>
                                            <td>{f.firstName}</td>
                                            <td>{f.lastName}</td>
                                            <td>{f.email}</td>
                                            <td>{f.phone}</td>
                                            <td>{f.cin}</td>
                                            <td>{new Date(f.dateAlerte).toLocaleDateString()}</td>
                                            <td>
                                                {f.cvFile ? (
                                                    <button
                                                        onClick={() => downloadCV(f.cvFile.replace(/^\/?uploads\/cv\//, ''))}>
                                                        Download CV
                                                    </button>
                                                ) : "N/A"}
                                            </td>
                                            <td>
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={f.active}
                                                        onChange={async () => {
                                                            try {
                                                                const user = await fetch(`http://localhost:8098/v1/users/${f.userId}/status`, {
                                                                    method: "PATCH",
                                                                    headers: {
                                                                        "Content-Type": "application/json",
                                                                        Authorization: `Bearer ${token}`
                                                                    },
                                                                    body: JSON.stringify({active: !f.active})
                                                                });
                                                                if (!user.ok) throw new Error("Failed to update status");

                                                                fetchValidatedFournisseurs();

                                                            } catch (err) {
                                                                console.error(err);
                                                                alert("Erreur lors du toggle: " + err.message);
                                                            }
                                                        }}
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No validated suppliers</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* ===================== users ===================== */}
                {activeSection === "users" && (
                    <div className="panel large">
                        <div className="users-info">
                            <p>
                                Here, you can efficiently manage all users. You can create new accounts for users,
                                update their information, delete users who no longer need access, and activate or
                                deactivate their status as needed.
                                Use the actions in the table below to quickly perform these tasks and maintain an
                                organized and secure user base.
                            </p>
                        </div>
                        <div className="users-header">
                            <div className="title-block">
                                <h3>User Management</h3>
                                <p>List of All Users</p>
                            </div>
                            <button className="create-btn" onClick={() => setShowForm(!showForm)}>
                                {showForm ? "Cancel" : "+ Create User"}
                            </button>
                        </div>

                        <table className="stock-table users-table">
                            <thead>
                            <tr>
                                <th> First Name</th>
                                <th> Last Name</th>
                                <th> Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.id}>

                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.roles?.join(", ")}</td>

                                    <td className="actions">

                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditingUser(user)}
                                        >
                                            <FaEdit/>
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <FaTrash/>
                                        </button>

                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={user.active}
                                                onChange={() => handleToggleStatus(user.id, user.active)}
                                            />
                                            <span className="slider round"></span>
                                        </label>

                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {/* ================= Pagination Buttons ================= */}
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            {Array.from({ length: Math.ceil(users.filter(u => !u.roles.includes("Fournisseur")).length / usersPerPage) }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={currentPage === i + 1 ? "active" : ""}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(users.filter(u => !u.roles.includes("Fournisseur")).length / usersPerPage)))}
                                disabled={currentPage === Math.ceil(users.filter(u => !u.roles.includes("Fournisseur")).length / usersPerPage)}
                            >
                                Next
                            </button>
                        </div>
                        {showForm && (
                            <div className="user-form-container">
                                <h4><FaUsers/> Create New User</h4>
                                <form className="user-form" onSubmit={(e) => {
                                    e.preventDefault();
                                    createUser();
                                }}>
                                    {formError && <p className="error-text">{formError}</p>}

                                    <div className="input-group">
                                        <FaUser className="input-icon"/>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={userData.firstName}
                                            onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <FaUser className="input-icon"/>
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={userData.lastName}
                                            onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <FaEnvelope className="input-icon"/>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <FaCog className="input-icon"/>
                                        <select
                                            className="role-select"
                                            value={userData.role[0]}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    role: [e.target.value]
                                                })
                                            }
                                        >
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Procurement Manager">Procurement Manager</option>
                                            <option value="Inventory Manager">Inventory Manager</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <FaLock className="input-icon"/>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={userData.password}
                                            onChange={(e) => setUserData({...userData, password: e.target.value})}
                                        />
                                    </div>

                                    <button className="create-btn">Save User</button>

                                </form>
                            </div>
                        )}

                        {editingUser && (
                            <div className="user-form-container">
                                <h4><FaEdit/> Edit User</h4>
                                <form className="user-form" onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdateUser();
                                }}>
                                    <div className="input-group">
                                        <FaUser className="input-icon"/>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={editingUser.firstName}
                                            onChange={e => setEditingUser({...editingUser, firstName: e.target.value})}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <FaUser className="input-icon"/>
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={editingUser.lastName}
                                            onChange={e => setEditingUser({...editingUser, lastName: e.target.value})}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <FaEnvelope className="input-icon"/>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={editingUser.email}
                                            onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <FaCog className="input-icon"/>
                                        <select
                                            className="role-select"
                                            value={editingUser.roles[0]}
                                            onChange={(e) => setEditingUser({...editingUser, roles: [e.target.value]})}>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Procurement Manager">Procurement Manager</option>
                                            <option value="Inventory Manager">Inventory Manager</option>
                                        </select>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="change-btn">Save Changes</button>
                                        <button type="button" className="cancel-btn"
                                                onClick={() => setEditingUser(null)}>Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* ===================== Settings ===================== */}
                {activeSection === "settings" && (
                    <div className="panel large">
                        <h3>System Settings</h3>
                        <p>Manage system configuration and security.</p>
                    </div>
                )}

                {/* ===================== Profile ===================== */}
                {activeSection === "profile" && (
                    <div className="panel large profile-panel">
                        <h3>Personal Information</h3>
                        <div className="profile-intro">
                            The administrator ensures system security, maintenance, and smooth operation.
                            Responsibilities include managing users and access rights, monitoring system performance,
                            maintaining security, and supporting other actors for a secure and efficient workflow.
                        </div>
                        {loading && <p>Loading profile...</p>}
                        {adminData && (

                            <form className="profile-form" onSubmit={handleUpdate}>
                                <div className="form-group"><label>First Name</label><input type="text"
                                                                                            value={adminData?.nom}
                                                                                            readOnly/></div>
                                <div className="form-group"><label>Last Name</label><input type="text"
                                                                                           value={adminData?.prenom}
                                                                                           readOnly/></div>
                                <div className="form-group"><label>Email</label><input type="email"
                                                                                       value={adminData.email}
                                                                                       readOnly/></div>
                                <div className="form-group"><label>Telephone</label>
                                    <input
                                        type="text"
                                        value={adminData.phone || ""}
                                        onChange={e => setAdminData({...adminData, phone: e.target.value})}
                                        placeholder="Enter phone number"
                                    /></div>
                                <div className="form-group"><label>CIN</label>
                                    <input
                                        type="text"
                                        value={adminData.cin || ""}
                                        onChange={e => setAdminData({...adminData, cin: e.target.value})}
                                        placeholder="Enter CIN"/>
                                </div>
                                <div className="form-group"><label>Join Date</label>
                                    <input type="text" value={adminData.createdAt || ""} readOnly/>
                                </div>
                                <button type="submit" className="create-btn">Update Profile</button>
                            </form>
                        )}
                    </div>
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
                                <p className="section-subtitle">List of All Products</p>
                            </div>
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
                                    <th className="th-info">Product Info</th>
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
                {activeSection === "categorys" && (
                    <div className="section-content category-section">

                        <div className="category-card-container">

                            <div className="table-description">
                                Category Management Hub: Use this dedicated panel to create new product categories, update existing specifications, or remove entries.
                                This interface provides a complete overview of your category hierarchy to ensure a well-organized catalog.
                            </div>
                            <div className="table-header-row">
                                <div className="title-block">
                                    <h3>Category Management</h3>
                                    <p>List of All Category</p>
                                </div>
                                <button className="btn-add" onClick={() => setShowCategoryForm(true)}>
                                    + New Category
                                </button>
                            </div>

                            {/* Table Container */}
                            <div className="table-inner-wrapper">
                                <table className="user-table">
                                    <thead>
                                    <tr>
                                        <th>Category Name</th>
                                        <th>Description</th>
                                        <th style={{textAlign: "center"}}>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {categories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td>
                                                <span className="category-name-badge">{cat.nom}</span>
                                            </td>
                                            <td className="text-muted">
                                                {cat.description || "No description available"}
                                            </td>
                                            <td>
                                                <div className="actions" style={{justifyContent: "center"}}>
                                                    <button className="edit-btn" title="Edit"
                                                            onClick={() => handleEditClick(cat)}>
                                                        <FaEdit/>
                                                    </button>
                                                    <button className="delete-btn" title="Delete"
                                                            onClick={() => deleteCategory(cat.id)}>
                                                        <FaTrash/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {showCategoryForm && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h3>{isEditing ? "Edit Category" : "Add a Category"}</h3>
                                    <form onSubmit={isEditing ? updateCategory : createCategory}>
                                        <div className="input-group">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Electronics"
                                                value={categoryData.nom}
                                                onChange={(e) => setCategoryData({...categoryData, nom: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Description</label>
                                            <textarea
                                                placeholder="Brief description of the category..."
                                                value={categoryData.description}
                                                onChange={(e) => setCategoryData({...categoryData, description: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button type="button" className="btn-cancel" onClick={resetCategoryForm}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn-save">
                                                {isEditing ? "Update" : "Save"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}