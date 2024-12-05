import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './AdminDash.css'; // Import the CSS file
import CustomerList from '../CustomerList/CustomerList'; // Importing CustomerList component
import logo from '../Assets/BugBusters.jpg'; // Adjust the path according to your structure

const AdminDashboard = ({ user, setUser }) => {
    const { firstName } = user;
    const [searchTerm, setSearchTerm] = useState(''); // State for search query

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="admin-dashboard-container">
            <img src={logo} alt="Company Logo" className="company-logo" /> 
            <h2>Admin Dashboard</h2>
            <h4>Welcome, {firstName}</h4> {/* Display admin's name */}

            {/* Search Bar for Customers */}
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search Customers..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
                    className="search-input"
                />
            </div>

            {/* Include Customer List for Admin */}
            <CustomerList user={user} searchTerm={searchTerm} /> {/* Pass search query to CustomerList */}

            {/* Button Container moved below Customer List */}
            <div className="button-container">
                {/* Link to Employee Management Page */}
                <Link to="/employee-management">
                    <button className='manage-employees-button'>Manage Employees</button> {/* Button to manage employees */}
                </Link>

                {/* Link to Create Service Report Page */}
                <Link to="/create-service-report">
                    <button className='create-service-report-button'>Create Service Report</button>
                </Link>

                {/* Link to Add Customer Page */}
                <Link to="/add-customer">
                    <button className='add-customer-button'>Add Customer</button>
                </Link>
            </div>

            {/* Logout button */}
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;