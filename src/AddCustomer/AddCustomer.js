import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddCustomer.css'; // Importing the CSS for styling

const AddCustomer = ({ user, customerId }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [newCustomer, setNewCustomer] = useState({ CFirstName: '', CLastName: '', CContact: '' });
    const [error, setError] = useState(''); // State to track validation errors

    // Safeguard: Check if user is available before accessing employeeid
    const { employeeid } = user || {};

    // If editing, fetch the customer data by ID
    useEffect(() => {
        console.log('editing',customerId);
        if (customerId) {
            const fetchCustomer = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/customer/${customerId}`);
                    setNewCustomer(response.data);
                } catch (error) {
                    console.error('Error fetching customer data:', error);
                    alert('Error fetching customer data');
                }
            };
            fetchCustomer();
        }
    }, [customerId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    const validatePhoneNumber = (phoneNumber) => {

        const phoneRegex = /^\d{11}$/;
        return phoneRegex.test(phoneNumber);
    };

    const checkPhoneNumberExists = async (phoneNumber) => {
        console.log('validating:', phoneNumber);
        try {
          const response = await axios.get(`http://localhost:3001/api/customer/exists/${phoneNumber}`);

          return response.data.exists; 
        } catch (error) {
          console.error('Error checking phone number:', error);
          return false;
        }
      };
      
    
      const handleAddOrUpdateCustomer = async () => {
        console.log('editing',customerId);


        setError('');
    
        if (!newCustomer.CFirstName || !newCustomer.CLastName || !newCustomer.CContact) {
            alert('Please fill in all fields.');
            return;
        }
    
        if (!validatePhoneNumber(newCustomer.CContact)) {
            setError('Please enter a valid 11-digit phone number.');
            return;
        }
    
        // If editing, check if the phone number has changed and if it exists
        let phoneExists = false;
        if (customerId) {
            // If we are editing, check if the phone number has changed
            const customer = await axios.get(`http://localhost:3001/api/customer/${customerId}`);
            if (customer.data.CContact !== newCustomer.CContact) {
                phoneExists = await checkPhoneNumberExists(newCustomer.CContact);
            }
        } else {
            // If we are adding a new customer, check if the phone number exists
            phoneExists = await checkPhoneNumberExists(newCustomer.CContact);
        }
    
        if (phoneExists) {
            setError('This phone number is already associated with another customer.');
            return;
        }
    
        try {
            if (customerId) {
                console.log(customerId)
                // Update existing customer
                const response = await axios.put(`http://localhost:3001/api/customer/${customerId}`, {
                    CFirstName: newCustomer.CFirstName,
                    CLastName: newCustomer.CLastName,
                    CContact: newCustomer.CContact,
                    UpdatedBy: employeeid, // Add the logged-in user's EmployeeID
                });
                console.log('Customer updated:', response.data);
            } else {
                // Create new customer
                const response = await axios.post('http://localhost:3001/api/customer', {
                    CFirstName: newCustomer.CFirstName,
                    CLastName: newCustomer.CLastName,
                    CContact: newCustomer.CContact,
                    CreatedBy: employeeid, // Add the logged-in user's EmployeeID
                });
                console.log('New customer added:', response.data);
            }
            navigate('/'); // Redirect to dashboard after adding or updating a customer
        } catch (error) {
            console.error('Error adding/updating customer:', error);
            alert('Error adding/updating customer');
        }
    };
    

    const handleCancel = () => {
        navigate('/'); // Navigate back to the dashboard
    };

    return (
        <div className="add-customer-container">
            <h2>{customerId ? 'Edit Customer' : 'Add New Customer'}</h2>
            <input
                type="text"
                name="CFirstName"
                placeholder="First Name"
                value={newCustomer.CFirstName}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="CLastName"
                placeholder="Last Name"
                value={newCustomer.CLastName}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="CContact"
                placeholder="Contact Number"
                value={newCustomer.CContact}
                onChange={handleInputChange}
            />
            
            {/* Display error message if phone number is invalid or already exists */}
            {error && <div className="error-message">{error}</div>}
            
            <button onClick={handleAddOrUpdateCustomer}>{customerId ? 'Update Customer' : 'Add Customer'}</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
    );
};

export default AddCustomer;
