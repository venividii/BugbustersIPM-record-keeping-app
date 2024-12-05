import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './AdminDash.css'; // Import the CSS file
import CustomerList from '../CustomerList/CustomerList'; // Importing CustomerList component
import logo from '../Assets/BugBusters.jpg'; // Adjust the path according to your structure

const AdminDashboard = ({ user, setUser }) => {
    const { firstName } = user;

    const handleLogout = () => {
        setUser(null);
        alert('You have logged out.');
    };

    return (
        <div className="admin-dashboard-container">
            <h2>Admin Dashboard</h2>
            <img src={logo} alt="Company Logo" className="company-logo" /> 
            <h4>Welcome, {firstName}</h4> {/* Display admin's name */}

            {/* Link to Employee Management Page */}
            <Link to="/employee-management">
                <button className='manage-employees-button'>Manage Employees</button> {/* Button to manage employees */}
            </Link>

            {/* Link to Create Service Report Page */}
            <Link to="/create-service-report-admin">
                <button className='create-service-report-button'>Create Service Report</button>
            </Link>

            {/* Include Customer List for Admin */}
            <CustomerList user={user}/>

            {/* Logout button */}
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;