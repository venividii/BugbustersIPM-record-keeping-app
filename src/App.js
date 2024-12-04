import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importing necessary components from react-router-dom
import './App.css';
import Login from './Login/Login.js'; 
import AdminDashboard from './AdminDashboard/AdminDashboard.js'; 
import Dashboard from './Dashboard/Dashboard.js'; 
import CreateQuotation from './CreateQuotation/CreateQuotation.js'; // Import CreateQuotation component
import CustomerList from './CustomerList/CustomerList.js';

function App() {
    const [user, setUser] = useState(null); // State to hold logged-in user
    console.log('Current user:', user); // Log the current user state

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            !user ? (
                                <Login setUser={setUser} />
                            ) : user.role === 'admin' ? (
                                <AdminDashboard user={user} setUser={setUser} />
                            ) : (
                                <Dashboard user={user} setUser={setUser} />
                            )
                        }
                    />
                    <Route path="/create-quotation" element={<CreateQuotation />} /> {/* Create Quotation Page */}
                    <Route path="/CustomerList" element={<CustomerList user={user} />} /> {/* Customer List Page */}
                    <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
                </Routes>
            </div>
        </Router>
    );
}


export default App;