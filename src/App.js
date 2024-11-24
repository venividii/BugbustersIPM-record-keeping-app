import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importing necessary components from react-router-dom
import './App.css';
import Login from './Login'; 
import AdminDashboard from './AdminDashboard'; 
import Dashboard from './Dashboard'; 
import CreateQuotation from './CreateQuotation'; // Import CreateQuotation component

const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'tech1', password: 'tech123', role: 'technician' },
];

function App() {
    const [user, setUser] = useState(null); // State to hold logged-in user

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route 
                        path="/" 
                        element={!user ? <Login setUser={setUser} users={users} /> : (user.role === 'admin' ? <AdminDashboard setUser={setUser} /> : <Dashboard user={user} setUser={setUser} />)} 
                    />
                    <Route path="/create-quotation" element={<CreateQuotation />} /> {/* Create Quotation Page */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;