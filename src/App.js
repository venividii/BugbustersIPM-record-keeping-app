import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import { EmployeeProvider } from './EmployeeContext'; // Import the provider
import AdminDashboard from './AdminDashboard/AdminDashboard.js'; // Your AdminDashboard component

function App() {
  return (
    <EmployeeProvider>
      <Router>
        <Routes> 
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        </Routes>
      </Router>
    </EmployeeProvider>
  );
}

export default App;
