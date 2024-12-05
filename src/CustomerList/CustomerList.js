import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerList.css'; // Importing CSS for styling
import { FaEdit, FaTrash, FaAddressBook } from 'react-icons/fa'; // Import the address icon

const CustomerList = ({ user, searchTerm }) => {
    const [customers, setCustomers] = useState([]);
    const [editCustomer, setEditCustomer] = useState(null); // To handle editing customers
    const [selectedCustomer, setSelectedCustomer] = useState(null); // To manage selected customer for addresses
    const [addresses, setAddresses] = useState([]); // To manage customer addresses
    const [showAddressModal, setShowAddressModal] = useState(false); // For toggling the modal

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
            console.log('Attempting to delete addresses for CustomerID:', CustomerID);

            // First, delete all associated addresses
           await axios.delete(`http://localhost:3001/api/customer/address/all/${CustomerID}`);
           console.log('deleted addresses for for CustomerID:', CustomerID);

            // Then, delete the customer
            await axios.delete(`http://localhost:3001/api/customer/${CustomerID}`);
    
            // Update the customers list in the state to reflect the deletion
            const updatedCustomers = customers.filter((customer) => customer.CustomerID !== CustomerID);
            setCustomers(updatedCustomers);
    
            alert('Customer and associated addresses deleted successfully!');
        } catch (error) {
            console.error('Error removing customer:', error);
            alert('Error removing customer');
        }
    };

    const handleEditCustomer = (customer) => {
        console.log('Editing customer:', customer);  // Check the customer details
        setEditCustomer(customer); // Set the customer to be edited
    };

    const handleShowAddressModal = async (customer) => {
        // Set the selected customer as an object
        setSelectedCustomer(customer);
        try {
            const response = await axios.get(`http://localhost:3001/api/customer/address/${customer.CustomerID}`);; // Set the fetched addresses into the state
            const customerAddresses = response.data;
            const filteredAddresses = customerAddresses.filter(address => address.CustomerID === customer.CustomerID);
            setAddresses(filteredAddresses); // Set the filtered addresses

        setShowAddressModal(true); // Show the address modal
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleAddAddress = async (newAddress) => {
        try {
            const response = await axios.post('http://localhost:3001/api/customer/address', newAddress);
            if (response.status === 201) {
                const addedAddress = {
                    ...newAddress,
                    CustAddID: response.data.CustAddID, // Add the generated CustAddID
                };
                setAddresses([...addresses, addedAddress]); // Add the new address to the list
                alert('Address added successfully!');
            } else {
                throw new Error('Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
            alert('Error adding address');
        }
    };

    const handleDeleteAddress = async (CustAddID) => {
        try {
            await axios.delete(`http://localhost:3001/api/customer/address/${CustAddID}`);
            const updatedAddresses = addresses.filter((address) => address.CustAddID !== CustAddID);
            setAddresses(updatedAddresses); // Remove the deleted address from the list
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Error deleting address');
        }
    };

    const handleCloseModal = () => {
        setShowAddressModal(false); // Close the modal
    };

    const filteredCustomers = customers.filter((customer) => {
        const fullName = `${customer.CFirstName} ${customer.CLastName}`.toLowerCase();
        return fullName.includes(searchTerm);
    });

    return (
        <div className="customer-list-container">
            <h2>Customer List</h2>
            <table className="customer-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map((customer) => {
                        const fullName = `${customer.CFirstName} ${customer.CLastName}`;
                        return (
                            <tr key={customer.CustomerID}>
                                <td>{fullName}</td>
                                <td>{customer.CContact}</td>
                                <td>
                                    <div className="action-icons">
                                        <FaEdit onClick={() => handleEditCustomer(customer)} className="action-icon edit-icon" />
                                        <FaTrash onClick={() => handleRemoveCustomer(customer.CustomerID)} className="action-icon delete-icon" />
                                        <FaAddressBook
                                            onClick={() => handleShowAddressModal(customer)} // Pass the entire customer object
                                            className="action-icon address-icon"
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {editCustomer && (
                <div className="edit-customer-form">
                    <h3>Edit Customer</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const updatedCustomer = {
                            ...editCustomer,
                            CFirstName: e.target.firstName.value,
                            CLastName: e.target.lastName.value,
                            CContact: e.target.contact.value,
                        };
                        // Send updated customer data to backend
                        axios.put(`http://localhost:3001/api/customer/${editCustomer.CustomerID}`, updatedCustomer)
                            .then(() => {
                                setCustomers(customers.map((customer) => 
                                    customer.CustomerID === editCustomer.CustomerID ? updatedCustomer : customer
                                ));
                                setEditCustomer(null);
                            })
                            .catch((error) => console.error('Error updating customer:', error));
                    }}>
                        <div className="form-inputs">
                            <input type="text" name="firstName" defaultValue={editCustomer.CFirstName} placeholder="First Name" required />
                            <input type="text" name="lastName" defaultValue={editCustomer.CLastName} placeholder="Last Name" required />
                            <input type="text" name="contact" defaultValue={editCustomer.CContact} placeholder="Contact Number" required />
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                    <button onClick={() => setEditCustomer(null)}>Cancel</button>
                </div>
            )}

            {/* Address Modal */}
            {showAddressModal && (
                <div className="address-modal">
                    <div className="modal-content">
                        <h3>Customer Addresses for {selectedCustomer?.CFirstName} {selectedCustomer?.CLastName}</h3>
                        <table className="address-table">
                            <thead>
                                <tr>
                                    <th>Province</th>
                                    <th>City</th>
                                    <th>Barangay</th>
                                    <th>Address Line 1</th>
                                    <th>Address Line 2</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addresses.length > 0 ? (
                                    addresses.map((address) => (
                                        <tr key={address.CustAddID}>
                                            <td>{address.Province}</td>
                                            <td>{address.City}</td>
                                            <td>{address.Barangay}</td>
                                            <td>{address.AddLine1}</td>
                                            <td>{address.AddLine2}</td>
                                            <td>
                                                <FaTrash onClick={() => handleDeleteAddress(address.CustAddID)} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No addresses found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Add Address Form */}
                        <div className="add-address-form">
                            <h4>Add Address</h4>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const newAddress = {
                                    CustomerID: selectedCustomer.CustomerID, // Use selectedCustomer for CustomerID
                                    Province: e.target.province.value,
                                    City: e.target.city.value,
                                    Barangay: e.target.barangay.value,
                                    AddLine1: e.target.addLine1.value,
                                    AddLine2: e.target.addLine2.value
                                };
                                handleAddAddress(newAddress);
                            }}>
                                <div className="form-inputs">
                                    <input type="text" name="province" placeholder="Province" required />
                                    <input type="text" name="city" placeholder="City" required />
                                    <input type="text" name="barangay" placeholder="Barangay" required />
                                    <input type="text" name="addLine1" placeholder="Address Line 1" required />
                                    <input type="text" name="addLine2" placeholder="Address Line 2" />
                                </div>
                                <button type="submit">Add Address</button>
                            </form>
                        </div>

                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;
