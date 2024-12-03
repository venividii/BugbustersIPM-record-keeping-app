import React, { useState } from 'react';
import './CustomerList.css'; // Importing CSS for styling

const CustomerList = () => {
    const [customers, setCustomers] = useState([
        { name: 'Theodore Roosevelt', place: 'Laguindingan', treatment: 'GPC' },
        { name: 'Sigma', place: 'Villanueva', treatment: 'Fogging' },
        { name: 'Adolf Hitler', place: 'Puerto', treatment: 'Termite Control' },
    ]);
    
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        place: '',
        treatment: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    const handleAddCustomer = () => {
        if (newCustomer.name && newCustomer.place && newCustomer.treatment) {
            setCustomers([...customers, newCustomer]);
            setNewCustomer({ name: '', place: '', treatment: '' }); // Reset input fields
        } else {
            alert("Please fill in all fields.");
        }
    };

    const handleRemoveCustomer = (index) => {
        const updatedCustomers = customers.filter((_, i) => i !== index);
        setCustomers(updatedCustomers);
    };

    return (
        <div className="customer-list-container">
            <h2>Customer List</h2>
            <table className="customer-table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Place of Service</th>
                        <th>Treatment Provided</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer, index) => (
                        <tr key={index}>
                            <td>{customer.name}</td>
                            <td>{customer.place}</td>
                            <td>{customer.treatment}</td>
                            <td>
                                <button onClick={() => handleRemoveCustomer(index)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Add New Customer</h3>
            <div className="add-customer-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Customer Name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="place"
                    placeholder="Place of Service"
                    value={newCustomer.place}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="treatment"
                    placeholder="Treatment Provided"
                    value={newCustomer.treatment}
                    onChange={handleInputChange}
                />
                <button onClick={handleAddCustomer}>Add Customer</button>
            </div>
        </div>
    );
};

export default CustomerList;