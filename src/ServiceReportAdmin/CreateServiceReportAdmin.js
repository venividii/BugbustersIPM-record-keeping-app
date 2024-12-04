// src/CreateServiceReport.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ServiceReportAdmin.css'; // Importing the new CSS file

const CreateServiceReportAdmin = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleCancel = () => {
        navigate('/admindashboard'); // Navigate back to the admin dashboard
    };

    return (
        <div className="service-report-container">
            <h2>Create Service Report</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="srid">SRID</label>
                    <input type="text" id="srid" name="srid" placeholder="SRID" required />
                </div>
                <div className="form-group">
                    <label htmlFor="customerId">Customer ID</label>
                    <input type="text" id="customerId" name="customerId" placeholder="Customer ID" required />
                </div>
                <div className="form-group">
                    <label htmlFor="treatment">Treatment</label>
                    <input type="text" id="treatment" name="treatment" placeholder="Treatment" required />
                </div>
                <div className="form-group">
                    <label htmlFor="pestNoted">Pest Noted</label>
                    <input type="text" id="pestNoted" name="pestNoted" placeholder="Pest Noted" required />
                </div>
                <div className="form-group">
                    <label htmlFor="serviceRemarks">Service Remarks</label>
                    <textarea id="serviceRemarks" name="serviceRemarks" placeholder="Service Remarks" required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" required />
                </div>
                <div className="form-group">
                    <label htmlFor="createdBy">Created By</label>
                    <input type="text" id="createdBy" name="createdBy" placeholder="Created By" required />
                </div>
                <div className="form-group">
                    <label htmlFor="custAddId">Customer Address ID</label>
                    <input type="text" id="custAddId" name="custAddId" placeholder="Customer Address ID" required />
                </div>

                <div className="button-container">
                    <button type="button">Submit Report</button>
                    <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CreateServiceReportAdmin;