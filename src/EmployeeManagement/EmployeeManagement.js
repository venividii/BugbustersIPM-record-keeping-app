// src/EmployeeManagement.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeManagement.css'; // Importing the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const EmployeeManagement = ({ user }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [technicians, setTechnicians] = useState([]); // State for technicians
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        PhoneNumber: '',
        Username: '',
        Role: 'technician', // Default Role as technician
        Password: '',
    });

    // Fetch technicians data when the component mounts
    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/employee');
                setTechnicians(response.data); // Update technicians state with the response data
            } catch (error) {
                console.error('Error fetching technicians:', error);
            }
        };
        fetchTechnicians();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleCreateTech = async (e) => {
        e.preventDefault();
    
        const { FirstName, LastName, PhoneNumber, Username, Role, Password } = formData;
    
        // Validate the phone number format (assumes validatePhoneNumber is defined elsewhere)
        const validatePhoneNumber = (phone) => {
            const phoneRegex = /^\d{11}$/;
            return phoneRegex.test(phone);
        };
    
        if (!validatePhoneNumber(PhoneNumber)) {
            alert('Please enter a valid 11-digit phone number.');
            return;
        }
    
        // Check for duplicate Username or PhoneNumber
        const isDuplicate = technicians.some(
            (tech) => tech.Username === Username || tech.PhoneNumber === PhoneNumber
        );
    
        if (isDuplicate) {
            alert('A technician with this Username or Phone Number already exists.');
            return;
        }
    
        // Check if all required fields are filled
        if (!FirstName || !LastName || !PhoneNumber || !Username || !Role || !Password) {
            alert('Please fill in all fields.');
            return;
        }
    
        // Proceed with creation if all validations pass
        try {
            const response = await axios.post('http://localhost:3001/api/employee', formData);
            const newTechnician = response.data;
    
            // Update the state with the new technician (masking Password for security)
            setTechnicians([...technicians, { ...newTechnician, Password: '********' }]);
    
            // Clear the form data after successful submission
            setFormData({ FirstName: '', LastName: '', PhoneNumber: '', Username: '', Role: 'technician', Password: '' });
    
            alert(`Technician ${newTechnician.Username} created successfully!`);
        } catch (error) {
            console.error('Error creating technician:', error);
            alert('Failed to create technician. Please try again.');
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

    const handleBack = () => {
        navigate('/'); // Navigate back to Admin Dashboard
    };

    return (
        <div className="employee-management-container">
            <h2>Employee Management</h2>
            
            <h3>Create Account</h3>
            <form onSubmit={handleCreateTech}>
                <div className="form-group">
                    <label htmlFor="FirstName">First Name:</label>
                    <input type="text" id="FirstName" name="FirstName" value={formData.FirstName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="LastName">Last Name:</label>
                    <input type="text" id="LastName" name="LastName" value={formData.LastName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="PhoneNumber">Phone Number:</label>
                    <input type="text" id="PhoneNumber" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="Username">Username:</label>
                    <input type="text" id="Username" name="Username" value={formData.Username} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="Role">Role:</label>
                    <select id="Role" name="Role" value={formData.Role} onChange={handleInputChange} required >
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Password">Password:</label>
                    <input type="password" id="Password" name="Password" value={formData.Password} onChange={handleInputChange} required />
                </div>
                <button className="create-button" type="submit">Create Employee</button>
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
                            <td><button className="delete-button" onClick={() => handleDeleteTech(tech.Username)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Back Button at the bottom */}
            <button className="back-button" onClick={handleBack}>Back</button> {/* Back button */}
        </div>
    );
};

export default EmployeeManagement;