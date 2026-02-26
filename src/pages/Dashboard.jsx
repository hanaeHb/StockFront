import React from "react";
import "./home.css";
import Navbar from "../components/Navbar";

const Home = () => {
    return (
        <>
            <Navbar />
            <div className="home">
                {/* ADMIN GREETING */}
                <div className="admin-header">
                    <h1>Hello Admin!</h1>
                    <p className="sub-header">Measure How Fast You're Growing Monthly Recurring performance management.</p>
                </div>

                {/* OVERVIEW CARDS */}
                <section className="overview">
                    <div className="stat-card" style={{ backgroundColor: '#ffedd5', borderTop: '4px solid #f97316' }}>
                        <h3>Users</h3>
                        <p className="stat-number">348</p>
                        <span className="stat-label">Users</span>
                    </div>
                    <div className="stat-card" style={{ backgroundColor: '#e0f2fe', borderTop: '4px solid #0ea5e9' }}>
                        <h3>Events</h3>
                        <p className="stat-number">128</p>
                        <span className="stat-label">Events</span>
                    </div>
                    <div className="stat-card" style={{ backgroundColor: '#fef9c3', borderTop: '4px solid #eab308' }}>
                        <h3>Holidays</h3>
                        <p className="stat-number">10</p>
                        <span className="stat-label">Holidays</span>
                    </div>
                    <div className="stat-card" style={{ backgroundColor: '#d1fae5', borderTop: '4px solid #10b981' }}>
                        <h3>Payrolls</h3>
                        <p className="stat-number">3458</p>
                        <span className="stat-label">Payrolls</span>
                    </div>
                    <div className="stat-card" style={{ backgroundColor: '#ddd6fe', borderTop: '4px solid #8b5cf6' }}>
                        <h3>Reports</h3>
                        <p className="stat-number">3488</p>
                        <span className="stat-label">Reports</span>
                    </div>
                </section>

                {/* CHARTS ROW */}
                <section className="charts-row">
                    {/* Salary Statistics */}
                    <div className="chart-card">
                        <h3>Salary Statistics</h3>
                        <div className="chart-container">
                            <div className="y-axis">
                                <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
                            </div>
                            <div className="chart-bars">
                                {/* simulated bar series with legend colors */}
                                <div className="bar-set">
                                    <div className="bar" style={{ height: '80%', backgroundColor: '#3b82f6' }}></div>
                                    <div className="bar" style={{ height: '65%', backgroundColor: '#f97316' }}></div>
                                    <div className="bar" style={{ height: '45%', backgroundColor: '#22c55e' }}></div>
                                    <div className="bar" style={{ height: '70%', backgroundColor: '#a855f7' }}></div>
                                </div>
                                <div className="bar-set">
                                    <div className="bar" style={{ height: '70%', backgroundColor: '#3b82f6' }}></div>
                                    <div className="bar" style={{ height: '55%', backgroundColor: '#f97316' }}></div>
                                    <div className="bar" style={{ height: '60%', backgroundColor: '#22c55e' }}></div>
                                    <div className="bar" style={{ height: '50%', backgroundColor: '#a855f7' }}></div>
                                </div>
                                <div className="bar-set">
                                    <div className="bar" style={{ height: '90%', backgroundColor: '#3b82f6' }}></div>
                                    <div className="bar" style={{ height: '75%', backgroundColor: '#f97316' }}></div>
                                    <div className="bar" style={{ height: '40%', backgroundColor: '#22c55e' }}></div>
                                    <div className="bar" style={{ height: '85%', backgroundColor: '#a855f7' }}></div>
                                </div>
                                {/* more sets... simplified */}
                            </div>
                            <div className="x-axis">
                                <span>2010</span><span>2014</span><span>2018</span><span>2023</span>
                            </div>
                        </div>
                        <div className="legend">
                            <span><span style={{ backgroundColor: '#3b82f6' }}></span> Developer Team</span>
                            <span><span style={{ backgroundColor: '#f97316' }}></span> Design Team</span>
                            <span><span style={{ backgroundColor: '#22c55e' }}></span> Marketing Team</span>
                            <span><span style={{ backgroundColor: '#a855f7' }}></span> Management Team</span>
                        </div>
                    </div>

                    {/* Performance Statistics */}
                    <div className="chart-card">
                        <h3>Performance Statistics</h3>
                        <div className="chart-container">
                            <div className="y-axis">
                                <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
                            </div>
                            <div className="chart-bars">
                                <div className="bar-set">
                                    <div className="bar" style={{ height: '60%', backgroundColor: '#3b82f6' }}></div>
                                    <div className="bar" style={{ height: '85%', backgroundColor: '#f97316' }}></div>
                                    <div className="bar" style={{ height: '55%', backgroundColor: '#22c55e' }}></div>
                                    <div className="bar" style={{ height: '70%', backgroundColor: '#a855f7' }}></div>
                                </div>
                                <div className="bar-set">
                                    <div className="bar" style={{ height: '75%', backgroundColor: '#3b82f6' }}></div>
                                    <div className="bar" style={{ height: '65%', backgroundColor: '#f97316' }}></div>
                                    <div className="bar" style={{ height: '80%', backgroundColor: '#22c55e' }}></div>
                                    <div className="bar" style={{ height: '50%', backgroundColor: '#a855f7' }}></div>
                                </div>
                                <div className="bar-set">
                                    <div className="bar" style={{ height: '65%', backgroundColor: '#3b82f6' }}></div>
                                    <div className="bar" style={{ height: '70%', backgroundColor: '#f97316' }}></div>
                                    <div className="bar" style={{ height: '45%', backgroundColor: '#22c55e' }}></div>
                                    <div className="bar" style={{ height: '60%', backgroundColor: '#a855f7' }}></div>
                                </div>
                            </div>
                            <div className="x-axis">
                                <span>2010</span><span>2014</span><span>2018</span><span>2023</span>
                            </div>
                        </div>
                        <div className="legend">
                            <span><span style={{ backgroundColor: '#3b82f6' }}></span> New Employees</span>
                            <span><span style={{ backgroundColor: '#f97316' }}></span> Developers</span>
                            <span><span style={{ backgroundColor: '#22c55e' }}></span> Managers</span>
                            <span><span style={{ backgroundColor: '#a855f7' }}></span> Support Staff</span>
                        </div>
                    </div>
                </section>

                {/* SECOND ROW: Employee Satisfaction + Annotations */}
                <section className="charts-row second">
                    <div className="chart-card satisfaction">
                        <h3>Employee Satisfaction</h3>
                        <div className="chart-container">
                            <div className="y-axis">
                                <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
                            </div>
                            <div className="chart-bars satisfaction-bars">
                                <div className="stack-bar">
                                    <div style={{ height: '40%', backgroundColor: '#ef4444' }}></div>
                                    <div style={{ height: '35%', backgroundColor: '#9ca3af' }}></div>
                                    <div style={{ height: '25%', backgroundColor: '#fde047' }}></div>
                                </div>
                                <div className="stack-bar">
                                    <div style={{ height: '55%', backgroundColor: '#ef4444' }}></div>
                                    <div style={{ height: '20%', backgroundColor: '#9ca3af' }}></div>
                                    <div style={{ height: '25%', backgroundColor: '#fde047' }}></div>
                                </div>
                                <div className="stack-bar">
                                    <div style={{ height: '30%', backgroundColor: '#ef4444' }}></div>
                                    <div style={{ height: '50%', backgroundColor: '#9ca3af' }}></div>
                                    <div style={{ height: '20%', backgroundColor: '#fde047' }}></div>
                                </div>
                            </div>
                            <div className="x-axis">
                                <span>2010</span><span>2014</span><span>2018</span><span>2023</span>
                            </div>
                        </div>
                        <div className="legend">
                            <span><span style={{ backgroundColor: '#ef4444' }}></span> Happy</span>
                            <span><span style={{ backgroundColor: '#9ca3af' }}></span> Neutral</span>
                            <span><span style={{ backgroundColor: '#fde047' }}></span> Sad</span>
                        </div>
                    </div>

                    {/* Chart Annotations */}
                    <div className="annotation-card">
                        <div className="annotation-left">
                            <p>2014</p><p>2015</p><p>2016</p><p>2017</p><p>2018</p>
                            <p>2019</p><p>2020</p><p>2021</p><p>2022</p><p>2023</p>
                            <p>0%</p><p>74%</p><p>100%</p>
                        </div>
                        <div className="annotation-right">
                            <p><strong>Sort by:</strong> Years</p>
                            <p><strong>Sort by:</strong> New Employees</p>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="footer">
                    <div className="footer-grid">
                        <div>
                            <h4>Product</h4>
                            <p>Inventory</p>
                            <p>Automation</p>
                            <p>Analytics</p>
                        </div>
                        <div>
                            <h4>Company</h4>
                            <p>About</p>
                            <p>Careers</p>
                            <p>Contact</p>
                        </div>
                        <div>
                            <h4>Resources</h4>
                            <p>Documentation</p>
                            <p>API</p>
                            <p>Support</p>
                        </div>
                        <div>
                            <h4>Newsletter</h4>
                            <input type="email" placeholder="Enter your email" />
                            <button className="btn-secondary">Subscribe</button>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        © 2026 Cloud-Native Stockflow. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Home;