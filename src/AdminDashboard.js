import React, { useState } from 'react';
import './AdminDash.css'; // Import the CSS file

const AdminDashboard = ({ setUser }) => {
    const [techUsername, setTechUsername] = useState('');
    const [technicians, setTechnicians] = useState([
        { username: 'tech1', role: 'technician' },
        { username: 'tech2', role: 'technician' },
    ]);

    const handleCreateTech = (e) => {
        e.preventDefault();
        if (techUsername) {
            setTechnicians([...technicians, { username: techUsername, role: 'technician' }]);
            setTechUsername('');
            alert(`Technician ${techUsername} created!`);
        }
    };

    const handleDeleteTech = (username) => {
        setTechnicians(technicians.filter(tech => tech.username !== username));
        alert(`Technician ${username} deleted!`);
    };

    const handleLogout = () => {
        setUser(null);
        alert('You have logged out.');
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
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
                <button className="create-button" type="submit">Create Technician</button>
            </form>

            <h3>Existing Technicians</h3>
            <ul>
                {technicians.map((tech, index) => (
                    <li key={index}>
                        {tech.username} 
                        <button className="delete-button" onClick={() => handleDeleteTech(tech.username)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;