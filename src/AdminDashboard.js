import React, { useState } from 'react';
import './AdminDash.css'; // Import the CSS file
import CustomerList from './CustomerList'; // Importing CustomerList component

const AdminDashboard = ({ setUser, adminName }) => {
    const [techUsername, setTechUsername] = useState('');
    const [techPassword, setTechPassword] = useState(''); // State for technician password
    const [technicians, setTechnicians] = useState([
        { username: 'tech1', role: 'technician' },
        { username: 'tech2', role: 'technician' },
    ]);

    const handleCreateTech = (e) => {
        e.preventDefault();
        if (techUsername && techPassword) {
            setTechnicians([...technicians, { username: techUsername, role: 'technician' }]);
            setTechUsername('');
            setTechPassword(''); // Reset password field
            alert(`Technician ${techUsername} created!`);
        } else {
            alert("Please fill in both username and password.");
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
            <button className="logout-button" onClick={handleLogout}>Logout</button>

            <h3>Create Technician Account</h3>
            <form onSubmit={handleCreateTech}>
                <div className="form-group">
                    <label htmlFor="techUsername">Technician Username:</label>
                    <input
                        type="text"
                        id="techUsername"
                        value={techUsername}
                        onChange={(e) => setTechUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="techPassword">Password:</label>
                    <input
                        type="password"
                        id="techPassword"
                        value={techPassword}
                        onChange={(e) => setTechPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="create-button" type="submit">Create Technician</button>
            </form>

            <h3>Existing Technicians</h3>
            <table className="technician-table">
                <thead>
                    <tr>
                        <th>Technician Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {technicians.map((tech, index) => (
                        <tr key={index}>
                            <td>{tech.username}</td>
                            <td>
                                {/* Only show delete button for admin */}
                                <button className="delete-button" onClick={() => handleDeleteTech(tech.username)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Include Customer List for Admin */}
            <h3>Customer List</h3>
            <CustomerList />
        </div>
    );
};

export default AdminDashboard;