import React from 'react';
import './Dashboard.css'; 
import CustomerList from '../CustomerList/CustomerList'; 
import { Link } from 'react-router-dom'; 

const Dashboard = ({ user, setUser }) => {
    const handleLogout = () => {
        setUser(null); 
        alert("You have logged out.");
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h3>Logged in as:</h3>
                {/* Check if user is not null before accessing username */}
                {user ? (
                    <p>{user.username}</p>
                ) : (
                    <p>No user logged in</p> // Fallback message if user is null
                )}

                {/* Logout button */}
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button> 
            </div>

            {/* Main content area */}
            <div className="main-content">
                <h2>Customer List</h2>
                {/* Customer List Section */}
                <CustomerList user={user}/>

                {/* Link to Create Service Report Page */}
                <Link to="/create-service-report">
                    <button className="dashboard-button">Create Service Report</button>
                </Link>

                {/* Link to Create Quotation Page */}
                <Link to="/create-quotation">
                    <button className="dashboard-button">Create Quotation</button>
                </Link>
            </div>
        </div >
    );
};

export default Dashboard;
