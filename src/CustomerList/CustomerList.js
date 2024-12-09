import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerList.css';
import { FaEdit, FaTrash, FaAddressBook, FaSearch } from 'react-icons/fa';


const CustomerList = ({ user, searchTerm }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null); // For current customer selection
    const [addresses, setAddresses] = useState([]); // To manage customer addresses
    const [serviceReports, setServiceReports] = useState([]); // To manage service reports
    const [editCustomerData, setEditCustomerData] = useState({}); // For editing customer data
    const [isEditing, setIsEditing] = useState(false); // To toggle edit mode
    const [isViewingAddresses, setIsViewingAddresses] = useState(false); // For viewing addresses
    const [isViewingReports, setIsViewingReports] = useState(false); // For viewing service reports
    const [loadingReports, setLoadingReports] = useState(false); // For loading state of reports
    const [customerAddresses, setCustomerAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [filteredServiceReports, setFilteredServiceReports] = useState([]);

    const handleAddressChange = (custAddID) => {
        const selected = customerAddresses.find((address) => address.CustAddID === parseInt(custAddID));
        setSelectedAddress(selected);
    
        if (selected) {
            const filtered = serviceReports.filter((report) => report.CustAddID === selected.CustAddID);
            setFilteredServiceReports(filtered);
        } else {
            setFilteredServiceReports(serviceReports); // Show all reports if no address is selected
        }
    };
    

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
    // Handle address deletion
    const handleDeleteAddress = async (CustAddID) => {
        try {
            // Step 1: Fetch service reports associated with the address
            const serviceReportsResponse = await axios.get(`http://localhost:3001/api/SR/address/${CustAddID}`);
            const serviceReportIDs = serviceReportsResponse.data.map((report) => report.srID);
            console.log('Service Reports to be deleted:', serviceReportIDs);
    
            // Step 2: Delete all ChemLogs if there are service reports
            if (serviceReportIDs.length > 0) {
                await Promise.all(
                    serviceReportIDs.map((srID) =>
                        axios.delete(`http://localhost:3001/api/SR/SRChems/SRID/${srID}`).catch((err) => {
                            console.warn(`No ChemLogs found for srID ${srID}:`, err.message);
                        })
                    )
                );
                console.log('Deleted ChemLogs successfully.');
            } else {
                console.log('No service reports found, skipping ChemLog deletion.');
            }
    
            // Step 3: Delete the service reports if there are any
            if (serviceReportIDs.length > 0) {
                await Promise.all(
                    serviceReportIDs.map((srID) =>
                        axios.delete(`http://localhost:3001/api/SR/${srID}`).catch((err) => {
                            console.warn(`Failed to delete service report with srID ${srID}:`, err.message);
                        })
                    )
                );
                console.log('Deleted service reports successfully.');
            } else {
                console.log('No service reports found, skipping service report deletion.');
            }
    
            // Step 4: Delete the address
            await axios.delete(`http://localhost:3001/api/customer/address/${CustAddID}`);
            console.log('Deleted address successfully.');
    
            // Step 5: Update state to remove the address from the UI
            setAddresses((prevAddresses) => prevAddresses.filter((address) => address.CustAddID !== CustAddID));
    
            alert('Address and related service reports deleted successfully!');
        } catch (error) {
            console.error('Error deleting address or related service reports:', error);
            alert('Failed to delete address and related service reports');
        }
    };
    
    
// Add a new address for a customer
const handleAddAddress = async (newAddress) => {
    try {
        await axios.post('http://localhost:3001/api/customer/address', newAddress);

        const updatedAddresses = await axios.get(`http://localhost:3001/api/customer/address/${newAddress.CustomerID}`);

        setAddresses(updatedAddresses.data);
        

        
        alert('Address added successfully!');
    } catch (error) {
        console.error('Error adding address:', error);
        alert('Failed to add address');
    }
};


const handleRemoveCustomer = async (CustomerID) => {
    try {
        // Step 1: Fetch all service reports for the customer
        let serviceReportIDs = [];
        try {
            const serviceReportsResponse = await axios.get(`http://localhost:3001/api/SR/all/${CustomerID}`);
            serviceReportIDs = serviceReportsResponse.data.map((report) => report.srID);
            console.log('Service Reports to be deleted:', serviceReportIDs);
        } catch (error) {
            console.log('No service reports found or error occurred:', error);
        }

        // Step 2: Delete associated ChemLogs for each service report
        if (serviceReportIDs.length > 0) {
            await Promise.all(
                serviceReportIDs.map((srID) =>
                    axios.delete(`http://localhost:3001/api/SR/SRChems/SRID/${srID}`).catch((err) => {
                        console.warn(`No ChemLogs found for srID ${srID}:`, err.message);
                    })
                )
            );
            console.log('Deleted ChemLogs successfully.');
        } else {
            console.log('No service reports found, skipping ChemLog deletion.');
        }

        // Step 3: Delete the service reports
        if (serviceReportIDs.length > 0) {
            await Promise.all(
                serviceReportIDs.map((srID) =>
                    axios.delete(`http://localhost:3001/api/SR/${srID}`).catch((err) => {
                        console.warn(`Failed to delete service report with srID ${srID}:`, err.message);
                    })
                )
            );
            console.log('Deleted service reports successfully.');
        } else {
            console.log('No service reports to delete.');
        }

        // Step 4: Delete all addresses associated with the customer
        await axios.delete(`http://localhost:3001/api/customer/address/all/${CustomerID}`);
        console.log('Deleted addresses successfully.');

        // Step 5: Delete the customer
        await axios.delete(`http://localhost:3001/api/customer/${CustomerID}`);
        console.log('Deleted customer successfully.');

        // Step 6: Update the customer list after deletion
        setCustomers(customers.filter((customer) => customer.CustomerID !== CustomerID));
        alert('Customer and related data deleted successfully!');
    } catch (error) {
        console.error('Error removing customer:', error);
        alert('Error removing customer');
    }
};

const checkPhoneNumberExists = async (phoneNumber) => {
    console.log('validating:', phoneNumber);
    try {
        const response = await axios.get(`http://localhost:3001/api/customer/exists/${phoneNumber}`);
        return response.data.exists;  // returns true or false
    } catch (error) {
        console.error('Error checking phone number:', error);
        return false;  // In case of error, assume the phone number doesn't exist
    }
};

    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setEditCustomerData({
            CFirstName: customer.CFirstName,
            CLastName: customer.CLastName,
            CContact: customer.CContact,
            CustomerID: customer.CustomerID,
        });

        setIsViewingReports(false); // Show service report modal
        setLoadingReports(false);
        setIsViewingAddresses(false);
        setIsEditing(true); // Open the edit modal
    };

    const handleSaveCustomer = async (event) => {
        event.preventDefault();
    
        // Validate if the phone number exists in the database
        const phoneExists = await checkPhoneNumberExists(editCustomerData.CContact);
 
        if (phoneExists && selectedCustomer?.CContact !== editCustomerData.CContact) {
            alert('This phone number is already associated with another customer.');
            return; 
        } else if (phoneExists && selectedCustomer?.CContact === editCustomerData.CContact){
            // Logic if the phone number does not exist or belongs to the same customer
            alert('User already has this phone number.');
            return;
        }
        try {
            // Proceed with the update request
            await axios.put(`http://localhost:3001/api/customer/${editCustomerData.CustomerID}`, editCustomerData);
    
            // Update customers state to reflect the changes
            setCustomers(customers.map((customer) =>
                customer.CustomerID === editCustomerData.CustomerID ? editCustomerData : customer
            ));
    
            alert('Customer updated successfully!');
            setIsEditing(false);  // Close the edit modal
            setSelectedCustomer(null);  // Clear selected customer
        } catch (error) {
            console.error('Error updating customer:', error);
            alert('Error updating customer');
        }
    };
    
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditCustomerData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleShowAddressModal = async (customer) => {
        setSelectedCustomer(null);
        setIsEditing(false); 
        setSelectedCustomer(customer);
        setIsViewingAddresses(true); // Show address modal
        try {
            const response = await axios.get(`http://localhost:3001/api/customer/address/${customer.CustomerID}`);
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };
    const handleFetchServiceReports = async (customer) => {
        setIsViewingAddresses(false);
        setIsEditing(false);
        setSelectedCustomer(null);
        setSelectedCustomer(customer);
        setIsViewingReports(true); // Show service report modal
        setLoadingReports(true);
    
        try {
            // Fetch customer addresses
            const addressResponse = await axios.get(`http://localhost:3001/api/customer/address/${customer.CustomerID}`);
            setCustomerAddresses(addressResponse.data);
    

            const response = await axios.get(`http://localhost:3001/api/SR/all/${customer.CustomerID}`);
            const serviceReports = response.data;
    

            const serviceReportIDs = serviceReports.map((report) => report.srID);
    

            const chemicalsData = await Promise.all(
                serviceReportIDs.map((srID) =>
                    axios.get(`http://localhost:3001/api/SR/SRChems/${srID}`).then((res) => res.data)
                )
            );
    
            // Merge chemical data into service reports
            const enhancedReports = serviceReports.map((report, index) => ({
                ...report,
                chemicals: chemicalsData[index], // Chemicals for this report
            }));
    
            // Update state with enriched service reports
            setServiceReports(enhancedReports);
            setFilteredServiceReports(enhancedReports); // Initially, show all reports
    
            console.log('Enhanced Service Reports:', enhancedReports);
        } catch (error) {
            console.error('Error fetching service reports or chemical data:', error);
            alert('Failed to fetch service reports or chemical data');
        } finally {
            setLoadingReports(false);
        }
    };
    
    const handleCloseModals = () => {
        setIsEditing(false);
        setIsViewingAddresses(false);
        setIsViewingReports(false);
        setSelectedCustomer(null);
    };

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
                    {filteredCustomers.map((customer) => (
                        <tr key={customer.CustomerID}>
                            <td>{`${customer.CFirstName} ${customer.CLastName}`}</td>
                            <td>{customer.CContact}</td>
                            <td>

                            <div className="action-icons">
    <div className="tooltip-wrapper">
        <FaAddressBook 
            onClick={() => handleShowAddressModal(customer)} 
            className="action-icon address-icon" 
        />
        <span className="tooltip">View and Create Addresses</span>
    </div>
    <div className="tooltip-wrapper">
        <FaSearch 
            onClick={() => handleFetchServiceReports(customer)} 
            className="action-icon search-icon" 
        />
        <span className="tooltip">View Service Reports</span>
    </div>
    <div className="tooltip-wrapper">
        <FaEdit 
            onClick={() => handleEditCustomer(customer)} 
            className="action-icon edit-icon" 
        />
        <span className="tooltip">Edit Customer</span>
    </div>
    <div className="tooltip-wrapper">
        <FaTrash 
            onClick={() => handleRemoveCustomer(customer.CustomerID)} 
            className="action-icon delete-icon" 
        />
        <span className="tooltip">Delete Customer</span>
    </div>
</div>


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {isEditing && (
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
                            <button type="button" onClick={handleCloseModals}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

{/* Service Reports Section */}
{isViewingReports && (
    <div className="service-reports-section">
        <h3>Service Reports for {selectedCustomer?.CFirstName} {selectedCustomer?.CLastName}</h3>

        {/* Address Selector */}
        <div className="address-selector">
            <label htmlFor="addressFilter" className="address-label">Filter by Address:</label>
            <select
                id="addressFilter"
                className="address-dropdown"
                value={selectedAddress?.CustAddID || ''}
                onChange={(e) => handleAddressChange(e.target.value)}
            >
                <option value="">All Addresses</option>
                {customerAddresses.map((address) => (
                    <option key={address.CustAddID} value={address.CustAddID}>
                        {address.AddLine1}, {address.Barangay}, {address.City}
                    </option>
                ))}
            </select>
        </div>

        {loadingReports ? (
            <p>Loading reports...</p>
        ) : serviceReports.length === 0 ? (
            <p>Customer does not have any service reports.</p>  
        ) : (
            <table className="service-reports-table">
                <thead>
                    <tr>
                        <th>Service Report ID</th>
                        <th>Date</th>
                        <th>Pests Noted</th>
                        <th>Service Remarks</th>
                        <th>Chems Applied</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredServiceReports.map((report) => (
                        <tr key={report.srID}>
                            <td>{report.srID}</td>
                            <td>{report.Date}</td>
                            <td>{report.PestNoted}</td>
                            <td>{report.ServiceRemarks}</td>
                            <td>
                                {report.chemicals?.map((chemical, index) => (
                                    <div key={index}>
                                        {chemical.ChemicalUsed} ({chemical.Qty} {chemical.Unit})
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

        <button onClick={handleCloseModals}>Close</button>
    </div>
)}


                   {/* Address Modal */}
                   {isViewingAddresses && (
                <div className="address-modal">
                    <div className="modal-content">
                        <h3>Customer Addresses for {selectedCustomer?.CFirstName} {selectedCustomer?.CLastName}</h3>

                        {/* Address Table */}
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
                                    CustomerID: selectedCustomer.CustomerID, // CustomerID should be passed from selectedCustomer
                                    Province: e.target.province.value,
                                    City: e.target.city.value,
                                    Barangay: e.target.barangay.value,
                                    AddLine1: e.target.addLine1.value,
                                    AddLine2: e.target.addLine2.value
                                };
                                handleAddAddress(newAddress); // Call the function to add the address
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

                        {/* Close Button */}
                        <button onClick={handleCloseModals}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;