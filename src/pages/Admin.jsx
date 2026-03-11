import React, { useState, useEffect, useRef } from "react";
import "./Admin.css";
import {
    FaBell,
    FaComments,
    FaChartBar,
    FaFolder,
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
    FaSearch
} from "react-icons/fa";
import { FiGrid, FiCreditCard } from "react-icons/fi";
import UsersRoleChart from "./UsersRoleChart";
import UsersStatusChart from "./UsersStatusChart";

export default function Admin() {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [showForm, setShowForm] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const dropdownRef = useRef(null);

    // ===================== Profile States =====================
    const API_URL = "http://localhost:8096/v1/users";
    const token = localStorage.getItem("token");
    const adminId = 1; // replace with dynamic ID if needed
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    const [userData, setUserData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        cin: "",
        role: ["Manager"]
    });

    const [profileData, setProfileData] = useState({
        metierRole: "Manager"
    });
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
        if (activeSection === "profile") {
            setLoading(true);
            fetch(`${API_URL}/${adminId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    setAdminData(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [activeSection, token]);

    // ===================== Update Profile =====================
    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedData = {
            phone: adminData.phone,
            cin: adminData.cin,
        };
        fetch(`${API_URL}/${adminId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update admin");
                return res.json();
            })
            .then((data) => {
                setAdminData(data);
                alert("Profile updated successfully");
            })
            .catch((err) => alert("Error updating profile: " + err.message));
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:8096/v1/users", {
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
        try {
            const userRes = await fetch("http://localhost:8096/v1/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!userRes.ok) {
                const err = await userRes.json();
                throw new Error(err.message || "Erreur lors de la création");
            }

            const user = await userRes.json();
            alert("User créé avec succès !");
            fetchUsers(); // refresh liste men DB
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
            alert("Erreur: " + error.message);
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
            const res = await fetch(`http://localhost:8096/v1/users/${id}`, {
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
            await fetch(`http://localhost:8096/v1/users/${id}/status`, {
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

                    <li className={activeSection === "products" ? "active" : ""}
                        onClick={() => setActiveSection("products")}>
                        <FaFolder/>
                    </li>

                    <li className={activeSection === "users" ? "active" : ""}
                        onClick={() => setActiveSection("users")}>
                        <FaUsers/>
                    </li>
                    <li className={activeSection === "products" ? "active" : ""}
                        onClick={() => setActiveSection("products")}>
                        <FaBoxes/>
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
                            <div className="nav-avatar small">
                                <FaBell/>
                                <span className="badge-number">3</span>
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
                        <p>{adminData.firstName}</p>
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
                                <h3>{users.length}</h3>
                                <p>Total Users</p>
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
                        <div className="charts-row" style={{ marginTop: "40px" }}>

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

                {activeSection === "users" && (
                    <div className="panel large">
                        <div className="users-info">
                            <p>
                                Here, you can efficiently manage all users. You can create new accounts for users, update their information, delete users who no longer need access, and activate or deactivate their status as needed.
                                Use the actions in the table below to quickly perform these tasks and maintain an organized and secure user base.
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
                                <th> Phone</th>
                                <th> CIN</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>

                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.cin}</td>
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

                        {showForm && (
                            <div className="user-form-container">
                                <h4><FaUsers/> Create New User</h4>
                                <form className="user-form" onSubmit={(e) => {
                                    e.preventDefault();
                                    createUser();
                                }}>

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
                                        <FaPhone className="input-icon"/>
                                        <input
                                            type="text"
                                            placeholder="Phone"
                                            value={userData.phone}
                                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <FiCreditCard className="input-icon"/>
                                        <input
                                            type="text"
                                            placeholder="CIN"
                                            value={userData.cin}
                                            onChange={(e) => setUserData({...userData, cin: e.target.value})}
                                        />
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

                                    <div className="input-group">
                                        <FaPhone className="input-icon"/>
                                        <input
                                            type="text"
                                            placeholder="Phone"
                                            value={editingUser.phone || ""}
                                            onChange={e => setEditingUser({...editingUser, phone: e.target.value})}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <FiCreditCard className="input-icon"/>
                                        <input
                                            type="text"
                                            placeholder="CIN"
                                            value={editingUser.cin || ""}
                                            onChange={e => setEditingUser({...editingUser, cin: e.target.value})}
                                        />
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
                                                                                            value={adminData.firstName}
                                                                                            readOnly/></div>
                                <div className="form-group"><label>Last Name</label><input type="text"
                                                                                           value={adminData.lastName}
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
                                    <input type="text" value={adminData.cin || ""}
                                           onChange={e => setAdminData({...adminData, cin: e.target.value})}
                                           placeholder="Enter CIN"/>
                                </div>
                                <div className="form-group"><label>Status</label>
                                    <input type="text" value={adminData.active ? "Active" : "Inactive"} readOnly/>
                                </div>
                                <div className="form-group"><label>Join Date</label>
                                    <input type="text" value={adminData.createdAt || ""} readOnly/>
                                </div>
                                <button type="submit" className="create-btn">Update Profile</button>
                            </form>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}