import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateServiceReport.css';

const CreateServiceReport = ({user}) => {
    console.log('User Data:', user); // Debugging to confirm user data is passed
    const navigate = useNavigate();
    const userid=user.employeeid


    const [formData, setFormData] = useState({
        Date: '',
        CustomerID: '',
        CustAddID: '',
        Treatment: '',
        PestNoted: '',
        ServiceRemarks: '',
        CreatedBy: userid|| '', // Initialize with the logged-in user's ID

    });

    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
    const [chemicals, setChemicals] = useState([]);


    // Fetch customers on mount
    useEffect(() => {
        axios.get('http://localhost:3001/api/customer')
            .then((response) => {
                console.log("Component mounted");
                console.log(response.data);
                setCustomers(response.data);
                setFilteredCustomers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching customers:', error);
            });
    }, []);

    // Fetch addresses when customer changes
    useEffect(() => {
        if (selectedCustomer) {
            console.log("Fetching addresses for customer:", selectedCustomer.CustomerID);
    
            axios
                .get(`http://localhost:3001/api/customer/address/${selectedCustomer.CustomerID}`)
                .then((response) => {
                    console.log("API response:", response.data);
    
                    const customerAddresses = response.data.filter(
                        (address) => address.CustomerID === selectedCustomer.CustomerID
                    );
    
                    console.log("Filtered Addresses:", customerAddresses);
    
                    setAddresses(customerAddresses);
                    setIsAddressDropdownOpen(customerAddresses.length > 0); 
                })
                .catch((error) => {
                    console.error("Error fetching addresses:", error);
                });
        } else {
            console.log("No customer selected. Resetting addresses.");
            setAddresses([]); 
            setIsAddressDropdownOpen(false); 
        }
    }, [selectedCustomer]);
    
    

    const handleCustomerSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = customers.filter((customer) =>
            customer.CFirstName.toLowerCase().includes(query.toLowerCase()) ||
            customer.CLastName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCustomers(filtered);
        setIsCustomerDropdownOpen(filtered.length > 0); 
    };

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setSearchQuery(`${customer.CFirstName} ${customer.CLastName}`);
        setFormData({ ...formData, CustomerID: customer.CustomerID });
        setIsCustomerDropdownOpen(false);
    };
    const handleAddressSelect = (addressId) => {
        console.log("Selected Address ID:", addressId);
    
        setFormData((prevFormData) => ({
            ...prevFormData,
            CustAddID: addressId,
        }));
    
        console.log("Updated Form Data:", { ...formData, CustAddID: addressId });
    
        setIsAddressDropdownOpen(false); 
    };

    useEffect(() => {
        console.log("Updated form data:", formData);
    }, [formData]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Chemicals being sent:', chemicals);
    
        try {

            const serviceReportResponse = await axios.post('http://localhost:3001/api/SR', formData);
            const srID = serviceReportResponse.data.srID;
            console.log('Service Report Created:', serviceReportResponse.data);
    

            const payload = {
                srID: srID,
                chemicals: chemicals.map(chemical => ({
                    ChemicalUsed: chemical.ChemicalUsed,
                    Qty: chemical.Qty,
                    Unit: chemical.Unit,
                }))
            };
    
            // Send the chemicals if any exist
            if (chemicals.length > 0) {
                const chemicalsResponse = await axios.post('http://localhost:3001/api/SR/SRChems', payload);
                console.log("Chemicals Logged:", chemicalsResponse.data);
            }
    
            // Navigate based on user role
            if (user) {
                if (user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            alert('Failed to submit service report or log chemicals. Please try again.');
        }
    };
    
          
    return (
        <div className="service-report-container">
            <h2>Create Service Report</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={formData.Date}
                        onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customer">Customer</label>
                    <input
                        type="text"
                        id="customer"
                        value={searchQuery}
                        onChange={handleCustomerSearch}
                        placeholder="Search for a customer"
                        autoComplete="off"
                        required
                    />
                    {isCustomerDropdownOpen && filteredCustomers.length > 0 && (
                        <ul className="customer-dropdown">
                            {filteredCustomers.map((customer) => (
                                <li key={customer.CustomerID} onClick={() => handleCustomerSelect(customer)}>
                                    {customer.CFirstName} {customer.CLastName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selectedCustomer && (
   <div className="form-group">
   <label htmlFor="address">Select Address</label>
   <div
       className="address-box"
       onClick={() => setIsAddressDropdownOpen((prev) => !prev)} // Toggle dropdown
   >
       {formData.CustAddID
           ? addresses.find((address) => address.CustAddID === formData.CustAddID)
               ? `${addresses.find((address) => address.CustAddID === formData.CustAddID).AddLine1}, 
                  ${addresses.find((address) => address.CustAddID === formData.CustAddID).City}, 
                  ${addresses.find((address) => address.CustAddID === formData.CustAddID).Province}`
               : "Select an address"
           : "Select an address"}
   </div>
   {isAddressDropdownOpen && (
       <ul className="address-list">
           {addresses.map((address) => (
               <li
                   key={address.CustAddID}
                   onClick={() => handleAddressSelect(address.CustAddID)}
               >
                   {address.AddLine1}, {address.City}, {address.Province}
               </li>
           ))}
       </ul>
   )}
</div>

)}


                <div className="form-group">
                    <label htmlFor="treatment">Treatment</label>
                    <input
                        type="text"
                        id="treatment"
                        value={formData.Treatment}
                        onChange={(e) => setFormData({ ...formData, Treatment: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="pestNoted">Pest Noted</label>
                    <input
                        type="text"
                        id="pestNoted"
                        value={formData.PestNoted}
                        onChange={(e) => setFormData({ ...formData, PestNoted: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="serviceRemarks">Service Remarks</label>
                    <textarea
                        id="serviceRemarks"
                        value={formData.ServiceRemarks}
                        onChange={(e) => setFormData({ ...formData, ServiceRemarks: e.target.value })}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
    <label>Chemicals Used</label>
    {chemicals.map((chemical, index) => (
        <div key={index} className="chemical-row">
            <input
                type="text"
                placeholder="Chemical Name"
                value={chemical.ChemicalUsed || ''}
                onChange={(e) =>
                    setChemicals((prev) =>
                        prev.map((chem, i) =>
                            i === index ? { ...chem, ChemicalUsed: e.target.value } : chem
                        )
                    )
                }
                required
            />
            <input
                type="number"
                placeholder="Qty"
                value={chemical.Qty || ''}
                onChange={(e) =>
                    setChemicals((prev) =>
                        prev.map((chem, i) =>
                            i === index ? { ...chem, Qty: e.target.value } : chem
                        )
                    )
                }
                required
            />
            <select
                value={chemical.Unit || ''}
                onChange={(e) =>
                    setChemicals((prev) =>
                        prev.map((chem, i) =>
                            i === index ? { ...chem, Unit: e.target.value } : chem
                        )
                    )
                }
                required
            >
                <option value="">Unit</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="L">L</option>
            </select>
            <button
                type="button"
                onClick={() =>
                    setChemicals((prev) => prev.filter((_, i) => i !== index))
                }
            >
                Remove
            </button>
        </div>
    ))}
    <button
        type="button"
        onClick={() =>
            setChemicals((prev) => [...prev, { ChemicalUsed: '', Qty: '', Unit: '' }])
        }
    >
        Add Chemical
    </button>
</div>

                <div className="form-actions">
                    <button type="submit">Submit Report</button>
                    <button type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CreateServiceReport;
