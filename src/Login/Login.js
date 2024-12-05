import React, { useState } from 'react';
import '../App.css'; 
import axios from 'axios';
import logo from '../Assets/BugBusters.jpg'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook for redirection

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/login', {
                Username: username,
                Password: password,
            });
            alert(response.data.message);

            const userData = {
                username: response.data.Username,
                role: response.data.Role,
                firstName: response.data.FirstName,
                employeeid: response.data.EmployeeID,
            };

            console.log('User data being set:', userData);
            setUser(userData); // Set user state with response data
            setUsername('');
            setPassword('');

            // Navigate to the appropriate dashboard based on user role
            if (response.data.Role === 'admin') {
                navigate('/'); // Admin dashboard
            } else {
                navigate('/dashboard'); // User dashboard
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error('Login error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-page">
            <img src={logo} alt="Company Logo" className="login-logo" /> {/* Logo outside of container */}
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;