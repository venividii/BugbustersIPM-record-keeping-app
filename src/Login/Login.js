import React, { useState } from 'react';
import '../App.css'; 
import axios from 'axios';

const Login = ({ setUser }) => { // Accept setUser as a prop
    const [username, setUsername] = useState(''); // Declare username state
    const [password, setPassword] = useState(''); // Declare password state

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/login', {
              Username: username,
              Password: password,
            });

            // Handle successful login
            alert(response.data.message);
            const userData = ({ username: response.data.Username, role: response.data.Role, firstName:response.data.FirstName,employeeid: response.data.EmployeeID });
            console.log('User data being set:', userData); 
            setUser(userData);

            // Clear input fields after successful login
            setUsername('');
            setPassword('');
        } catch (error) {
            // Handle errors
            if (error.response && error.response.data.message) {
                alert(error.response.data.message); // Backend error
            } else {
                console.error('Login error:', error);
                alert('An unexpected error occurred. Please try again.'); // Fallback error
            }
        }
    };

    return (
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
    );
};

export default Login;
