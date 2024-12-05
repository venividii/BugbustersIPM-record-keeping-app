import React from 'react';
import './Dashboard.css'; 
import CustomerList from '../CustomerList/CustomerList'; 


import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const Dashboard = ({ user, setUser }) => {
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const handleLogout = () => {
        setUser(null); 
        navigate('/login'); // Redirect to login page after logout
        alert("You have logged out.");
    };
    console.log('Current user:', user); // Log the current user state

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
                <button className="logout-button" onClick={handleLogout}> Logout </button> 
            </div>

            {/* Main content area */}
            <div className="main-content">
                <h2>Tech Dashboard</h2>
                {/* Customer List Section */}
                <CustomerList user={user}/>

                <div className="button-container">
    <Link to="/create-service-report">
        <button className="dashboard-button">Create Service Report</button>
    </Link>

    <Link to="/create-quotation">
        <button className="dashboard-button">Create Quotation</button>
    </Link>
</div>
            </div>
        </div >
    );
};

export default Dashboard;
