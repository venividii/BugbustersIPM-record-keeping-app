import React, { useState } from 'react';
import './App.css';
import Login from './Login'; 
import AdminDashboard from './AdminDashboard'; 
import Dashboard from './Dashboard'; 

const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'tech1', password: 'tech123', role: 'technician' },
];

function App() {
    const [user, setUser] = useState(null); // State to hold logged-in user

    return (
        <div className="App">
            {!user ? (
                <Login setUser={setUser} users={users} /> // Render Login if no user is logged in
            ) : user.role === 'admin' ? (
                <AdminDashboard setUser={setUser} /> // Pass setUser to Admin Dashboard
            ) : (
                <Dashboard /> // Render Dashboard if user is technician
            )}
        </div>
    );
}

export default App;