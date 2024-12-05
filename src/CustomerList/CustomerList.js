import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerList.css'; // Importing CSS for styling
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for redirection

const CustomerList = ({ user }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [customers, setCustomers] = useState([]);
    const [editCustomer, setEditCustomer] = useState(null); // To handle editing customers

    // If user is null, redirect to login page
    useEffect(() => {
        if (!user) {
            navigate('/login'); // Redirect to login page if user is not authenticated
        }
    }, [user, navigate]);

    // Fetch customer data when the component mounts
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/customer');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchCustomers();
    }, []);

    const handleRemoveCustomer = async (CustomerID) => {
        try {
            await axios.delete(`http://localhost:3001/api/customer/${CustomerID}`);
            const updatedCustomers = customers.filter((customer) => customer.CustomerID !== CustomerID);
            setCustomers(updatedCustomers);
        } catch (error) {
            console.error('Error removing customer:', error);
            alert('Error removing customer');
        }
    };

    const handleEditCustomer = (customer) => {
        setEditCustomer(customer); // Set the customer to be edited
    };

    const handleUpdateCustomer = async () => {
        if (editCustomer.CFirstName && editCustomer.CLastName && editCustomer.CContact) {
            try {
                const response = await axios.put(`http://localhost:3001/api/customer/${editCustomer.CustomerID}`, {
                    CFirstName: editCustomer.CFirstName,
                    CLastName: editCustomer.CLastName,
                    CContact: editCustomer.CContact,
                });
                setCustomers(customers.map((customer) =>
                    customer.CustomerID === editCustomer.CustomerID ? response.data : customer
                ));
                setEditCustomer(null); // Reset edit form after update
            } catch (error) {
                console.error('Error updating customer:', error);
                alert('Error updating customer');
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    if (!user) {
        return <div>Loading...</div>; // Render a loading state until the user is available
    }

    return (
        <div className="customer-list-container">
            <h2>Customer List</h2>
            <table className="customer-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.CustomerID}>
                            <td>{customer.CFirstName}</td>
                            <td>{customer.CLastName}</td>
                            <td>{customer.CContact}</td>
                            <td>
                                <div className="action-icons">
                                    <FaEdit onClick={() => handleEditCustomer(customer)} className="action-icon edit-icon" />
                                    <FaTrash onClick={() => handleRemoveCustomer(customer.CustomerID)} className="action-icon delete-icon" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editCustomer && (
                <div className="edit-customer-form">
                    <h3>Edit Customer</h3>
                    <input type="text" name="CFirstName" placeholder="First Name" value={editCustomer.CFirstName} onChange={(e) => setEditCustomer({ ...editCustomer, CFirstName: e.target.value })} />
                    <input type="text" name="CLastName" placeholder="Last Name" value={editCustomer.CLastName} onChange={(e) => setEditCustomer({ ...editCustomer, CLastName: e.target.value })} />
                    <input type="text" name="CContact" placeholder="Contact Number" value={editCustomer.CContact} onChange={(e) => setEditCustomer({ ...editCustomer, CContact: e.target.value })} />
                    <button onClick={handleUpdateCustomer}>Update Customer</button>
                </div>
            )}
        </div>
    );
};

export default CustomerList;