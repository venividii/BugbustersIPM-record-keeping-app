import React, { useState } from 'react';
import './Dashboard.css'; 
import CustomerList from '../CustomerList/CustomerList'; 
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser }) => {
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const handleLogout = () => {
        setUser(null); 
        navigate('/login'); // Redirect to login page after logout
    };

    console.log('Current user:', user); // Log the current user state

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h3>Logged in as:</h3>
                {user ? (
                    <p>{user.username}</p>
                ) : (
                    <p>No user logged in</p>
                )}
                <button className="logout-button" onClick={handleLogout}> Logout </button> 
            </div>

            <div className="main-content">
                <h2>Tech Dashboard</h2>

                {/* Search Bar for Customer List */}
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search customers..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="search-bar"
                    />
                </div>

                {/* Customer List Section */}
                <CustomerList user={user} searchTerm={searchTerm} />

                <div className="button-container">
                    <Link to="/create-service-report">
                        <button className="dashboard-button">Create Service Report</button>
                    </Link>

                    <Link to="/create-quotation">
                        <button className="dashboard-button">Create Quotation</button>
                    </Link>

                    {/* Link to Add New Customer Page */}
                    <Link to="/add-customer">
                        <button className="dashboard-button">Add New Customer</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;