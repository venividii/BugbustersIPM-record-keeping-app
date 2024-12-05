import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddCustomer.css'; // Importing the CSS for styling

const AddCustomer = ({ user }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [newCustomer, setNewCustomer] = useState({ CFirstName: '', CLastName: '', CContact: '' });

    // Safeguard: Check if user is available before accessing employeeid
    const { employeeid } = user || {};

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    const handleAddCustomer = async () => {
        if (newCustomer.CFirstName && newCustomer.CLastName && newCustomer.CContact) {
            try {
                const response = await axios.post('http://localhost:3001/api/customer', {
                    CFirstName: newCustomer.CFirstName,
                    CLastName: newCustomer.CLastName,
                    CContact: newCustomer.CContact,
                    CreatedBy: employeeid, // Add the logged-in user's EmployeeID
                });
                console.log('New customer added:', response.data);
                navigate('/'); // Redirect to dashboard after adding a customer
            } catch (error) {
                console.error('Error adding customer:', error);
                alert('Error adding customer');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    const handleCancel = () => {
        navigate('/'); // Navigate back to the dashboard
    };

    return (
        <div className="add-customer-container">
            <h2>Add New Customer</h2>
            <input type="text" name="CFirstName" placeholder="First Name" value={newCustomer.CFirstName} onChange={handleInputChange} />
            <input type="text" name="CLastName" placeholder="Last Name" value={newCustomer.CLastName} onChange={handleInputChange} />
            <input type="text" name="CContact" placeholder="Contact Number" value={newCustomer.CContact} onChange={handleInputChange} />
            <button onClick={handleAddCustomer}>Add Customer</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button> {/* Cancel button */}
        </div>
    );
};

export default AddCustomer;