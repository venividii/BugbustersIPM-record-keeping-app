import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDash.css'; 
import CustomerList from '../CustomerList/CustomerList'; 
import logo from '../Assets/BugBusters.jpg'; 
import { Link } from 'react-router-dom'; 
import { useEmployee } from '../EmployeeContext'; // Import the useEmployee hook

const AdminDashboard = () => {
    const { employeeId, logout } = useEmployee(); // Access employeeId and logout from context
    const [technicians, setTechnicians] = useState([]);
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        PhoneNumber: '',
        Username: '',
        Role: 'technician',
        Password: '',
    });

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/employee');
                setTechnicians(response.data);
            } catch (error) {
                console.error('Error fetching technicians:', error);
            }
        };
        fetchTechnicians();
    }, []);

    const handleLogout = () => {
        logout(); // Clear employeeId from context
        alert('You have logged out.');
    };

    const handleCreateTech = async (e) => {
        e.preventDefault();
        const { FirstName, LastName, PhoneNumber, Username, Role, Password } = formData;

        if (FirstName && LastName && PhoneNumber && Username && Role && Password) {
            try {
                const response = await axios.post('http://localhost:3001/api/employee', formData);
                const newTechnician = response.data;
                setTechnicians([...technicians, newTechnician]);
                setFormData({
                    FirstName: '',
                    LastName: '',
                    PhoneNumber: '',
                    Username: '',
                    Role: 'technician',
                    Password: '',
                });
                alert(`Technician ${newTechnician.Username} created successfully!`);
            } catch (error) {
                console.error('Error creating technician:', error);
                alert('Failed to create technician. Please try again.');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleDeleteTech = async (username) => {
        const techToDelete = technicians.find(tech => tech.Username === username);
        if (techToDelete && window.confirm(`Are you sure you want to delete technician ${username}?`)) {
            try {
                await axios.delete(`http://localhost:3001/api/employee/${techToDelete.EmployeeID}`);
                setTechnicians(technicians.filter(tech => tech.Username !== username));
                alert(`Technician ${username} deleted!`);
            } catch (error) {
                console.error('Error deleting technician:', error);
                alert('Failed to delete technician. Please try again.');
            }
        }
    };

    return (
        <div className="admin-dashboard-container">
            <h2>Admin Dashboard</h2>
            <img src={logo} alt="Company Logo" className="company-logo" />
            <h4>Welcome, Admin {employeeId}</h4> {/* Display employeeId for now, replace with actual employee data if needed */}

            <Link to="/create-service-report-admin">
                <button className='create-report-button'>Create Service Report</button>
            </Link>
            <h3>Create Account</h3>
            <form onSubmit={handleCreateTech}>
                {/* Form for creating technician */}
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
                            <td>{tech.FirstName}</td>
                            <td>{tech.LastName}</td>
                            <td>{tech.PhoneNumber}</td>
                            <td>{tech.Username}</td>
                            <td>{tech.Role}</td>
                            <td>
                                <button className="delete-button" onClick={() => handleDeleteTech(tech.Username)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <CustomerList user={employeeId} />

            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;
