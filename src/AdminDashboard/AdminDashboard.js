import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDash.css'; // Import the CSS file
import CustomerList from '../CustomerList/CustomerList'; // Importing CustomerList component

const AdminDashboard = ({user,setUser}) => {
    console.log('AdminDashboard user:', user); // Ensure user is passed correctly
    const [technicians, setTechnicians] = useState([]); // Declare state for technicians
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
    
        // Destructure formData
        const { FirstName, LastName, PhoneNumber, Username, Role, Password } = formData;
        console.log('Sending formData to backend:', formData);

        // Validate all fields are filled
        if (FirstName && LastName && PhoneNumber && Username && Role && Password) {
            try {
                // Log form data for debugging
                console.log('Sending formData to backend:', formData);
    
                // Send form data to the backend to create a technician
                const response = await axios.post('http://localhost:3001/api/employee', formData);
    
                // Extract the new technician data from the backend response
                const newTechnician = response.data;
    
                // Update the local technicians state with the new technician
                setTechnicians([...technicians, {
                    FirstName: newTechnician.FirstName,
                    LastName: newTechnician.LastName,
                    PhoneNumber: newTechnician.PhoneNumber,
                    Username: newTechnician.Username,
                    Role: newTechnician.Role,
                    Password: '********', // Mask the password in UI (for security)
                }]);
    
                // Reset form fields
                setFormData({
                    FirstName: '',
                    LastName: '',
                    PhoneNumber: '',
                    Username: '',
                    Role: 'technician', // Default value for role
                    Password: '',
                });
    
                // Notify the admin
                alert(`Technician ${newTechnician.Username} created successfully!`);
            } catch (error) {
                console.error('Error creating technician:', error);
                alert('Failed to create technician. Please try again.');
            }
        } else {
            alert("Please fill in all fields.");
        }
    };
    const handleDeleteTech = async (username) => {
        // Find the technician's EmployeeID based on the username
        const techToDelete = technicians.find(tech => tech.Username === username);
    
        if (techToDelete && window.confirm(`Are you sure you want to delete technician ${username}?`)) {
            try {
                // Send DELETE request to the backend with EmployeeID
                await axios.delete(`http://localhost:3001/api/employee/${techToDelete.EmployeeID}`);
                
                // Update the local technicians state by filtering out the deleted technician
                setTechnicians(technicians.filter(tech => tech.Username !== username));
                alert(`Technician ${username} deleted!`);
            } catch (error) {
                console.error('Error deleting technician:', error);
                alert('Failed to delete technician. Please try again.');
            }
        }
    };
    

    const handleLogout = () => {
        setUser(null);
        alert('You have logged out.');
    };
    const {firstName } = user; 

 
    return (
        <div className="admin-dashboard-container">
            <h2>Admin Dashboard</h2>
            <h4>Welcome, {firstName}</h4> {/* Display admin's name */}
            <CustomerList user={user} />
            
            <h3>Create Account</h3>
            <form onSubmit={handleCreateTech}>
                <div className="form-group">
                    <label htmlFor="FirstName">First Name:</label>
                    <input
                        type="text"
                        id="FirstName"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="LastName">Last Name:</label>
                    <input
                        type="text"
                        id="LastName"
                        name="LastName"
                        value={formData.LastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="PhoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="PhoneNumber"
                        name="PhoneNumber"
                        value={formData.PhoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Username">Username:</label>
                    <input
                        type="text"
                        id="Username"
                        name="Username"
                        value={formData.Username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Role">Role:</label>
                    <select
                        id="Role"
                        name="Role"
                        value={formData.Role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Password">Password:</label>
                    <input
                        type="password"
                        id="Password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleInputChange}
                        required
                    />
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
                            <td>
                                <button className="delete-button" onClick={() => handleDeleteTech(tech.Username)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Include Customer List for Admin */}
    
            <CustomerList user={user}/>

            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;
