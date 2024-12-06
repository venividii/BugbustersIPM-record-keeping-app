import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerList.css'; // Importing CSS for styling
import { FaEdit, FaTrash, FaAddressBook, FaSearch } from 'react-icons/fa'; // Import the address and search icon

const CustomerList = ({ user, searchTerm }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null); // For editing customer details and addresses
    const [addresses, setAddresses] = useState([]); // To manage customer addresses
    const [showAddressModal, setShowAddressModal] = useState(false); // For toggling the modal
    const [serviceReports, setServiceReports] = useState([]); // To manage fetched service reports
    const [loadingReports, setLoadingReports] = useState(false); // For loading state of reports
    const [editCustomerData, setEditCustomerData] = useState({}); // For the customer data being edited

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
            console.log('Deleted addresses for CustomerID:', CustomerID);
    
            // Then, delete all associated ServiceReports
            await axios.delete(`http://localhost:3001/api/SR/customer/all/${CustomerID}`);
            console.log('Deleted ServiceReports for CustomerID:', CustomerID);
    

            // Then, delete the customer
            await axios.delete(`http://localhost:3001/api/customer/${CustomerID}`);
            console.log('Deleted Customer with CustomerID:', CustomerID);
    
            // Update the customers list in the state to reflect the deletion
            const updatedCustomers = customers.filter((customer) => customer.CustomerID !== CustomerID);
            setCustomers(updatedCustomers);
    
            alert('Customer, associated addresses, ServiceReports, and SRchemUsage deleted successfully!');
        } catch (error) {
            console.error('Error removing customer:', error);
            alert('Error removing customer');
        }
    };
    

    // Handle customer edit (opens the modal for editing)
    const handleEditCustomer = (customer) => {
        console.log('Editing customer:', customer);  // Check the customer details
        setSelectedCustomer(customer);
        setEditCustomerData({
            CFirstName: customer.CFirstName,
            CLastName: customer.CLastName,
            CContact: customer.CContact,
            CustomerID: customer.CustomerID
        });
    };

    // Handle customer update (save the edited data)
    const handleSaveCustomer = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:3001/api/customer/${editCustomerData.CustomerID}`, editCustomerData);
            const updatedCustomers = customers.map((customer) =>
                customer.CustomerID === editCustomerData.CustomerID ? editCustomerData : customer
            );
            setCustomers(updatedCustomers);
            alert('Customer updated successfully!');
            setSelectedCustomer(null); // Close the edit mode
        } catch (error) {
            console.error('Error updating customer:', error);
            alert('Error updating customer');
        }
    };

    // Handle input changes for editing customer data
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditCustomerData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle address deletion
    const handleDeleteAddress = async (CustAddID) => {
        try {
            // Send a DELETE request to remove the address
            await axios.delete(`http://localhost:3001/api/customer/address/${CustAddID}`);
            // After deleting, filter out the deleted address from the list in the state
            setAddresses((prevAddresses) => prevAddresses.filter((address) => address.CustAddID !== CustAddID));
            alert('Address deleted successfully!');
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address');
        }
    };

    // Show the address modal and fetch customer addresses
    const handleShowAddressModal = async (customer) => {
        setSelectedCustomer(customer);
        try {
            const response = await axios.get(`http://localhost:3001/api/customer/address/${customer.CustomerID}`);
            const customerAddresses = response.data;
            setAddresses(customerAddresses); // Set the fetched addresses
            setShowAddressModal(true); // Show the address modal
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    // Fetch service reports for a customer
    const handleFetchServiceReports = async (CustomerID) => {
        setLoadingReports(true);
        try {
            const response = await axios.get(`http://localhost:3001/api/SR/all/${CustomerID}`);
            setServiceReports(response.data); // Store the service reports in the state
        } catch (error) {
            console.error('Error fetching service reports:', error);
            alert('Failed to fetch service reports');
        } finally {
            setLoadingReports(false);
        }
    };

    // Add a new address for a customer
    const handleAddAddress = async (newAddress) => {
        try {
            const response = await axios.post(`http://localhost:3001/api/customer/address`, newAddress);
            setAddresses((prevAddresses) => [...prevAddresses, response.data]);
            alert('Address added successfully!');
        } catch (error) {
            console.error('Error adding address:', error);
            alert('Failed to add address');
        }
    };

    // Close the address modal
    const handleCloseModal = () => {
        setShowAddressModal(false); // Close the modal
    };

    // Filter customers based on the search term
    const filteredCustomers = customers.filter((customer) => {
        const fullName = `${customer.CFirstName} ${customer.CLastName}`.toLowerCase();
        const contact = customer.CContact.toString().toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || contact.includes(searchTerm.toLowerCase());
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
                                        <FaAddressBook onClick={() => handleShowAddressModal(customer)} className="action-icon address-icon" />
                                        <FaSearch onClick={() => handleFetchServiceReports(customer.CustomerID)} className="action-icon search-icon" />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Edit Customer Form */}
            {selectedCustomer && (
                <div className="edit-customer-form">
                    <h3>Edit Customer</h3>
                    <form onSubmit={handleSaveCustomer}>
                        <div>
                            <label htmlFor="CFirstName">First Name:</label>
                            <input
                                type="text"
                                id="CFirstName"
                                name="CFirstName"
                                value={editCustomerData.CFirstName}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="CLastName">Last Name:</label>
                            <input
                                type="text"
                                id="CLastName"
                                name="CLastName"
                                value={editCustomerData.CLastName}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="CContact">Contact Number:</label>
                            <input
                                type="text"
                                id="CContact"
                                name="CContact"
                                value={editCustomerData.CContact}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div>
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setSelectedCustomer(null)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Service Reports Section */}
            {serviceReports.length > 0 && (
                <div className="service-reports-section">
                    <h3>Service Reports for {selectedCustomer?.CFirstName} {selectedCustomer?.CLastName}</h3>
                    {loadingReports ? (
                        <p>Loading reports...</p>
                    ) : (
                        <table className="service-reports-table">
                            <thead>
                                <tr>
                                    <th>Service Report ID</th>
                                    <th>Date</th>
                                    <th>Chemicals Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceReports.map((report) => (
                                    <tr key={report.srID}>
                                        <td>{report.srID}</td>
                                        <td>{report.date}</td>
                                        <td>
                                            {report.chemicals?.map((chemical, index) => (
                                                <p key={index}>
                                                    {chemical.ChemicalUsed} ({chemical.Qty} {chemical.Unit})
                                                </p>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
