import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import logo from '../Assets/BugBusters.jpg'; // Adjust path as necessary
import { useEmployee } from '../EmployeeContext'; // Import EmployeeContext

const Login = () => {
    const { login } = useEmployee(); // Access the login function from context
    const [username, setUsername] = useState(''); // State for username
    const [password, setPassword] = useState(''); // State for password

    // Handle login submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/login', {
                Username: username,
                Password: password,
            });

            // Check response and alert success message
            if (response.data && response.data.EmployeeID) {
                alert(response.data.message);

                // Extract user data from response
                const userData = {
                    username: response.data.Username,
                    role: response.data.Role,
                    firstName: response.data.FirstName,
                    employeeId: response.data.EmployeeID, // Match context naming
                };

                console.log('User data being set:', userData); // Log user data
                login(userData.employeeId); // Set EmployeeID in context
                setUsername(''); // Clear username input
                setPassword(''); // Clear password input

                // Redirect or update UI as needed (e.g., navigate to a dashboard)
                window.location.href = '/dashboard'; // Example redirection
            } else {
                throw new Error('Invalid response from server.');
            }
        } catch (error) {
            // Handle errors and show appropriate messages
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
            <img src={logo} alt="Company Logo" className="login-logo" /> {/* Logo */}
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
