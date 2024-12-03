import React, { useState } from 'react';
import './AdminDash.css'; // Import the CSS file
import CustomerList from '../CustomerList/CustomerList'; // Importing CustomerList component

const AdminDashboard = ({ setUser, adminName }) => {
    const [technicians, setTechnicians] = useState([
        { firstName: 'Tech', lastName: 'One', phoneNumber: '1234567890', username: 'tech1', role: 'technician', password: 'password1' },
        { firstName: 'Tech', lastName: 'Two', phoneNumber: '9876543210', username: 'tech2', role: 'technician', password: 'password2' },
    ]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        username: '',
        role: 'technician', // Default role as technician
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreateTech = (e) => {
        e.preventDefault();
        const { firstName, lastName, phoneNumber, username, role, password } = formData;

        if (firstName && lastName && phoneNumber && username && role && password) {
            setTechnicians([...technicians, { ...formData }]);
            setFormData({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                username: '',
                role: 'technician', // Reset to default role
                password: '',
            });
            alert(`Technician ${username} created!`);
        } else {
            alert("Please fill in all fields.");
        }
    };

    const handleDeleteTech = (username) => {
        if (window.confirm(`Are you sure you want to delete technician ${username}?`)) {
            setTechnicians(technicians.filter(tech => tech.username !== username));
            alert(`Technician ${username} deleted!`);
        }
    };

    const handleLogout = () => {
        setUser(null);
        alert('You have logged out.');
    };

    return (
        <div className="admin-dashboard-container">
            <h2>Admin Dashboard</h2>
            <h4>Welcome, {adminName}</h4> {/* Display admin's name */}
            

            <h3>Create Technician Account</h3>
            <form onSubmit={handleCreateTech}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button className="create-button" type="submit">Create Technician</button>
            </form>

            <h3>Existing Technicians</h3>
            <table className="technician-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {technicians.map((tech, index) => (
                        <tr key={index}>
                            <td>{tech.firstName}</td>
                            <td>{tech.lastName}</td>
                            <td>{tech.phoneNumber}</td>
                            <td>{tech.username}</td>
                            <td>{tech.role}</td>
                            <td>
                                <button className="delete-button" onClick={() => handleDeleteTech(tech.username)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Include Customer List for Admin */}
            <h3>Customer List</h3>
            <CustomerList />
            
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;
