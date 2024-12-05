// src/context/EmployeeContext.js
import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [employeeId, setEmployeeId] = useState(localStorage.getItem('employeeId') || null); // Get from localStorage if available

    const login = (newEmployeeId) => {
        setEmployeeId(newEmployeeId);
        localStorage.setItem('employeeId', newEmployeeId); // Store in localStorage for persistence
    };

    const logout = () => {
        setEmployeeId(null);
        localStorage.removeItem('employeeId'); // Remove from localStorage on logout
    };

    return (
        <EmployeeContext.Provider value={{ employeeId, login, logout }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployee = () => useContext(EmployeeContext);
