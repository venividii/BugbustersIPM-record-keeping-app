import React from 'react';
import './Dashboard.css'; // Ensure this CSS file is imported
import CustomerList from '../CustomerList/CustomerList'; // Importing CustomerList component
import { Link } from 'react-router-dom'; // Import Link for navigation

const Dashboard = ({ user, setUser }) => {
    const handleLogout = () => {
        setUser(null); // Log out by resetting the user state
        alert("You have logged out.");
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h3>Logged in as:</h3>
                <p>{user.username}</p>

                {/* Logout button */}
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button> 
            </div>

            {/* Main content area */}
            <div className="main-content">
                <h2>Customer List</h2>
                {/* Customer List Section */}
                <CustomerList />

                {/* Link to Create Quotation Page */}
                <Link to="/create-quotation">
                    <button className="dashboard-button">Create Quotation</button>
                </Link>
            </div>
        </div >
    );
};

export default Dashboard;