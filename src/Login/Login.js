import React, { useState } from 'react';
import '../App.css'; 
//import Register from '../Register'; 


const Login = ({ setUser, users }) => { // Accept users as a prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  //  const [isRegistering, setIsRegistering] = useState(false); 

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const user = users.find(user => user.username === username && user.password === password);
        
        if (user) {
            alert(`Login successful! Role: ${user.role}`);
            setUser(user); // Set the logged-in user in the parent component
        } else {
            alert('Invalid username or password');
        }
        
        setUsername('');
        setPassword('');
    };

    return (
        <div className="login-container">
            { (
                <>
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
                   
                </>
            )}
        </div>
    );
};

export default Login;