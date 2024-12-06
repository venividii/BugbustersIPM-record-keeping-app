import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login/Login.js';
import AdminDashboard from './AdminDashboard/AdminDashboard.js';
import Dashboard from './Dashboard/Dashboard.js';
import CreateQuotation from './CreateQuotation/CreateQuotation.js';
import CustomerList from './CustomerList/CustomerList.js';
import CreateServiceReport from './CreateServiceReport/CreateServiceReport.js';
import EmployeeManagement from './EmployeeManagement/EmployeeManagement.js';
import AddCustomer from './AddCustomer/AddCustomer.js'; // Importing the new AddCustomer component

function App() {
    const [user, setUser] = useState(null); // State to hold logged-in user
    console.log('Current user:', user); // Log the current user state

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Route to login page */}
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    
                    {/* Default route based on user state */}
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
                     <Route path="/admin-dashboard" element={<AdminDashboard user={user} setUser={setUser} />} />
                    <Route path="/create-quotation" element={<CreateQuotation user={user} />} />
                    <Route path="/customer-list" element={<CustomerList user={user} />} />
                    <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
                    <Route path="/create-service-report" element={<CreateServiceReport user={user} />} />

                    <Route path="/employee-management" element={<EmployeeManagement user={user} />} />
                    <Route path="/add-customer" element={<AddCustomer user={user} />} /> {/* New route for adding customers */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;