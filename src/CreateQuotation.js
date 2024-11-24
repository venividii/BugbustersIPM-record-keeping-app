import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './CreateQuotation.css'; // Importing CSS for styling

const CreateQuotation = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [formData, setFormData] = useState({
        clientName: '',
        contactNo: '',
        address: '',
        technicianName: '',
        placeOfService: '',
        treatmentProvided: '',
        pestNoted: '',
        serviceRemarks: '',
        products: [],
    });

    const [product, setProduct] = useState({ name: '', usage: '' });
    const [otherPlace, setOtherPlace] = useState(''); // State for other place of service
    const [otherTreatment, setOtherTreatment] = useState(''); // State for other treatment provided
    const [otherPest, setOtherPest] = useState(''); // State for other pest noted

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleAddProduct = () => {
        if (product.name && product.usage) {
            setFormData({
                ...formData,
                products: [...formData.products, product],
            });
            setProduct({ name: '', usage: '' }); // Reset product fields
        } else {
            alert("Please fill in both product name and usage.");
        }
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = formData.products.filter((_, i) => i !== index);
        setFormData({ ...formData, products: updatedProducts });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Quotation submitted:', formData);
        // Here you would typically handle form submission to a backend or state management
    };

    return (
        <div className="quotation-container">
            <h2>Create Quotation</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Client Name:</label>
                    <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Contact No.:</label>
                    <input type="tel" name="contactNo" value={formData.contactNo} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Technician Name:</label>
                    <input type="text" name="technicianName" value={formData.technicianName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Place of Service:</label>
                    <select 
                        name="placeOfService" 
                        value={formData.placeOfService} 
                        onChange={(e) => {
                            handleInputChange(e);
                            if (e.target.value === 'Other') setOtherPlace(''); // Reset other place when selecting
                        }} 
                        required
                    >
                        <option value="">Select...</option>
                        <option value="Villa">Villa</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Factory">Factory</option>
                        <option value="Other">Other</option>
                    </select>
                    {formData.placeOfService === 'Other' && (
                        <input 
                            type="text" 
                            placeholder="Specify Other Place"
                            value={otherPlace}
                            onChange={(e) => setOtherPlace(e.target.value)}
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>Treatment Provided:</label>
                    <select 
                        name="treatmentProvided" 
                        value={formData.treatmentProvided} 
                        onChange={(e) => {
                            handleInputChange(e);
                            if (e.target.value === 'Others') setOtherTreatment(''); // Reset other treatment when selecting
                        }} 
                        required
                    >
                        <option value="">Select...</option>
                        <option value="GPC">GPC</option>
                        <option value="Rodent Control">Rodent Control</option>
                        <option value="Fumigation">Fumigation</option>
                        <option value="Fogging">Fogging</option>
                        <option value="Termite Control">Termite Control</option>
                        <option value="Others">Others</option>
                    </select>
                    {formData.treatmentProvided === 'Others' && (
                        <input 
                            type="text" 
                            placeholder="Specify Other Treatment"
                            value={otherTreatment}
                            onChange={(e) => setOtherTreatment(e.target.value)}
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>Pest Noted:</label>
                    <select 
                        name="pestNoted" 
                        value={formData.pestNoted} 
                        onChange={(e) => {
                            handleInputChange(e);
                            if (e.target.value === 'Others') setOtherPest(''); // Reset other pest when selecting
                        }} 
                        required
                    >
                        <option value="">Select...</option>
                        {["Bed bugs", "Flies", "Mosquitoes", "G. Cockroach", "A. Cockroach", "Mice", "Roof rats", "Norway rats", "Mosquito breeding site", "Fly breeding site", "None", "Others"].map(pest => (
                            <option key={pest} value={pest}>{pest}</option>
                        ))}
                    </select>
                    {formData.pestNoted === 'Others' && (
                        <input 
                            type="text" 
                            placeholder="Specify Other Pest"
                            value={otherPest}
                            onChange={(e) => setOtherPest(e.target.value)}
                        />
                    )}
                </div>

                {/* Service Remarks */}
                <div className="form-group">
                    <label>Service Remarks:</label>
                    <textarea name="serviceRemarks" rows="4" value={formData.serviceRemarks} onChange={handleInputChange}></textarea>
                </div>

                {/* Product/Equipment Used Table */}
                <h3>Products/Equipment Used</h3>

                {/* Product Input Fields */}
                <div className="product-inputs">
                    <input
                        type="text"
                        name="name"
                        placeholder="Product/Equipment Name"
                        value={product.name}
                        onChange={handleProductChange}
                    />
                    <input
                        type="text"
                        name="usage"
                        placeholder="Total Usage"
                        value={product.usage}
                        onChange={handleProductChange}
                    />
                    <button type="button" onClick={handleAddProduct}>Add Product</button>
                </div>

                {/* Product Table */}
                {formData.products.length > 0 && (
                    <>
                      {/* Table for Products */}
                      <table className='product-table'>
                          <thead>
                              <tr>
                                  <th>Product/Equipment Name</th>
                                  <th>Total Usage</th>
                                  <th>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {formData.products.map((prod, index) => (
                                  <tr key={index}>
                                      <td>{prod.name}</td>
                                      <td>{prod.usage}</td>
                                      <td><button onClick={() => handleRemoveProduct(index)}>Remove</button></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table> 
                  </>
              )}

              {/* Button Section */}
              {/* Separate Submit and Cancel buttons */}
              {/* Adding margin to separate it visually */}
              {/* Ensure buttons are not stuck to the table */}
              {/* Adjust styles as needed */}
              {/* You can also wrap them in a div for better alignment */}
              <div style={{ marginTop: '20px' }}>
                  {/* Submit Button */}
                  <button type='submit'>Submit Quotation</button>

                  {/* Cancel Button */}
                  {/* Navigate back to dashboard when clicked */}
                  {/* Use navigate function from react-router-dom */}
                  {/* Add a cancel handler function */}
                  &nbsp; {/* Add space between buttons */}
                  <button type='button' onClick={() => navigate('/dashboard')}>Cancel</button> 
              </div>

          </form>

      </div >
  );
};

export default CreateQuotation;