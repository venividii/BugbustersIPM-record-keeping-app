import React, { useState } from 'react';

const Register = ({ setIsRegistering }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        console.log('Creating account for:', username);
        
        // Here you would typically send this data to your backend to create a new user
        alert('Account created successfully! You can now log in.');
        
        // Reset form after submission
        setUsername('');
        setPassword('');
        
        // Switch back to login after registration
        setIsRegistering(false);
    };

    return (
        <div className="register-container">
            <h2>Create Account</h2>
            <form onSubmit={handleRegisterSubmit}>
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
                <button type="submit">Create Account</button>
            </form>
            <p>
                Already have an account?{' '}
                <button onClick={() => setIsRegistering(false)}>Login</button>
            </p>
        </div>
    );
};

export default Register;