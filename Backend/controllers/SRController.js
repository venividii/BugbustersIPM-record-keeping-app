import sqlite3 from 'sqlite3';
import db from '../database/db.js';  
sqlite3.verbose();
import dotenv from 'dotenv';
dotenv.config();

export const CreateServiceReport = (req, res) => {
    console.log('CreateServiceReport: Request Body:', req.body); 

    const {Date,CustomerID,Treatment,PestNoted,ServiceRemarks,CustAddID,CreatedBy} = req.body;

    if (!Date||!CustomerID||!Treatment||!PestNoted||!ServiceRemarks||!CreatedBy||!CustAddID) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log('Received Date1:', Date);

        const query = 'INSERT INTO ServiceReport(Date,CustomerID,Treatment,PestNoted,ServiceRemarks,CreatedBy,CustAddID) VALUES (?,?,?,?,?,?,?)';
    
    db.run(query, [Date,CustomerID,Treatment,PestNoted,ServiceRemarks,CreatedBy,CustAddID], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create ServiceReport', details: err.message });
      }
      res.status(201).json({ message: 'ServiceReport created', srID: this.lastID });
      console.log('Received Date2:', Date);

    });
  };

  

  export const GetSRbyID = (req, res) => {
    const CustomerID = req.params.id;
  
    const query = `
      SELECT 
       Date,
       CustomerID,
       Treatment,
       PestNoted,
       ServiceRemarks,
       CreatedBy,
       CustAddID

      FROM 
        ServiceReport
      WHERE 
        ServiceReport = ?
    `;
  
    db.get(query, [CustomerID], (err, row) => {
      if (err) {
        console.error('Error fetching Customer:', err.message);
        return res.status(500).json({
          error: 'Failed to fetch Customer',
          details: err.message,
        });
      }
  
      if (!row) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(row);
    });
  };
  

  export const deleteSR = (req, res) => {
    const {srID} = req.params;
  
    if (!srID) {
        return res.status(400).json({ error: 'srID is required' });
    }
  
    const query = 'DELETE FROM ServiceReport WHERE srID = ?';
  
    db.run(query, [srID], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete SR', details: err.message });
        }
  
        if (this.changes === 0) {
            return res.status(404).json({ error: 'SR not found' });
        }
  
        res.status(200).json({ message: 'SR deleted successfully' });
    });
  };




  export const updateSR= (req, res) => {
    const {srID } = req.params; // Get the EmployeeID from the route parameter
    const {Date,CustomerID,Treatment,PestNoted,ServiceRemarks,CreatedBy,CustAddID} = req.body; // Get updated fields from the request body
    
    if (!srID) {
        return res.status(400).json({ error: 'srID is required' });
    }
  
    if (!Date&&!CustomerID&&!Treatment&&!PestNoted&&!ServiceRemarks&&!CreatedBy&&!CustAddID) {
        return res.status(400).json({ error: 'At least one field to update is required' });
    }
  
    const fieldsToUpdate = [];
    const values = [];
  
    if (Date) {
        fieldsToUpdate.push('Date = ?');
        values.push(Date);
    }
    if (CustomerID) {
        fieldsToUpdate.push('CustomerID = ?');
        values.push(CustomerID);
    }
    if (Treatment) {
        fieldsToUpdate.push('Treatment = ?');
        values.push(Treatment);
    }
    if (PestNoted) {
        fieldsToUpdate.push('PestNoted = ?');
        values.push(PestNoted);
    }
    if (ServiceRemarks) {
        fieldsToUpdate.push('ServiceRemarks = ?');
        values.push(ServiceRemarks);
    }
    if (CreatedBy) {
        fieldsToUpdate.push('CreatedBy = ?');
        values.push(CreatedBy);
    }
    if (CustAddID) {
        fieldsToUpdate.push('CustAddID = ?');
        values.push(CustAddID);
    }

    const query = `UPDATE ServiceReport SET ${fieldsToUpdate.join(', ')} WHERE srID = ?`;
    values.push(srID);
  
    db.run(query, values, function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update SR', details: err.message });
        }
  
        if (this.changes === 0) {
            return res.status(404).json({ error: 'SR not found' });
        }
  
        res.status(200).json({ message: 'SR updated successfully' });
    });
  };
  
  export const LogChems = (req, res) => {
    console.log('Request Body:', req.body);

    const { srID, chemicals } = req.body;

    // Validate the payload structure
    if (!srID || !Array.isArray(chemicals) || chemicals.length === 0) {
        return res.status(400).json({ error: 'Missing required fields or invalid structure' });
    }

    // Prepare the SQL query
    const query = 'INSERT INTO SRChemUsage(srID, ChemicalUsed, Qty, Unit) VALUES (?, ?, ?, ?)';

    // Iterate over the chemicals array and insert each one
    const promises = chemicals.map(({ ChemicalUsed, Qty, Unit }) => {
        return new Promise((resolve, reject) => {
            db.run(query, [srID, ChemicalUsed, Qty, Unit], function (err) {
                if (err) {
                    reject({ error: 'Failed to create ChemLog', details: err.message });
                } else {
                    resolve({ message: 'ChemLog created', SRChemUsageID: this.lastID });
                }
            });
        });
    });

    // Handle all insertions
    Promise.all(promises)
        .then(results => {
            res.status(201).json({
                message: 'All chemicals logged successfully',
                results,
            });
        })
        .catch(error => {
            console.error('Error logging chemicals:', error);
            res.status(500).json({ error: 'Failed to log some or all chemicals', details: error });
        });
};

  export const GetChemLogbyID= (req, res) => {
    const {SRChemUsageID} = req.params; // Extract srID from the request parameters
    const query = `
      SELECT 
        ChemicalUsed,
        Qty,
        Unit
      FROM 
        SRchemUsage
      WHERE 
        SRChemUsageID =?
    `;
  
    db.all(query, [SRChemUsageID], (err, rows) => {
      if (err) {
        console.error('Error fetching ServiceReports:', err.message);
        return res.status(500).json({
          error: 'Failed to fetch Service Reports',
          details: err.message,
        });
      }

      res.json(rows);
    });
  };
  

  
  export const DeleteChemLog = (req, res) => {
    const {SRChemUsageID} = req.params;
      
    if (!SRChemUsageID) {
        return res.status(400).json({ error: 'SRChemUsageID is required' });
    }
  
    const query = 'DELETE FROM SRchemUsage WHERE SRChemUsageID = ?';
  
    db.run(query, [SRChemUsageID], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete ChemLog', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'ChemLog not found' });
        }
        res.status(200).json({ message: 'ChemLog deleted successfully' });
    });
  };

  export const UpdateChemLog= (req, res) => {
    const {SRChemUsageID} = req.params; // Get the EmployeeID from the route parameter
    const {srID,ChemicalUsed,Qty,Unit} = req.body; // Get updated fields from the request body
    
    if (!SRChemUsageID) {
        return res.status(400).json({ error: 'SRChemUsageID required' });
    }
    if (!srID&&!ChemicalUsed&&!Qty&&!Unit) {
        return res.status(400).json({ error: 'At least one field to update is required' });
    }
    const fieldsToUpdate = [];
    const values = [];
  
    if (srID) {
        fieldsToUpdate.push('srID = ?');
        values.push(srID);
    }
    if (ChemicalUsed) {
        fieldsToUpdate.push('ChemicalUsed = ?');
        values.push(ChemicalUsed);
    }
    if (Qty) {
        fieldsToUpdate.push('Qty = ?');
        values.push(Qty);
    }

    if (Unit) {
        fieldsToUpdate.push('Unit = ?');
        values.push(Unit);
    }
    const query = `UPDATE SRchemUsage SET ${fieldsToUpdate.join(', ')} WHERE SRChemUsageID = ?`;
    values.push(SRChemUsageID);
  
    db.run(query, values, function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update Chemusage', details: err.message });
        }
  
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Chemusage not found' });
        }

        res.status(200).json({ message: 'ChemUsage updated successfully' });
    });
  };
  //tech crud
  export const createTechLog = (req, res) => {
    const {srID, TechID } = req.body;

    if (!srID|| !TechID) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO TechniciansPresent (srID, TechID) VALUES (?, ?)';

    db.run(query, [srID, TechID], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to create technician', details: err.message });
        }
        res.status(201).json({ message: 'Technician created', TechLogID: this.lastID });
    });
};

export const getTechLog = (req, res) => {
    const { TechLogID } = req.params;

    const query = 'SELECT * FROM TechniciansPresent WHERE TechLogID = ?';

    db.get(query, [TechLogID], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve technician', details: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Technician not found' });
        }
        res.status(200).json(row);
    });
};

export const updateTechLog = (req, res) => {
    const { TechLogID } = req.params;
    const {TechID} = req.body;

    if (!TechID) {
        return res.status(400).json({ error: 'No fields provided to update' });
    }

    const query = 'UPDATE TechniciansPresent SET TechID = ? WHERE TechLogID = ?';

    db.run(query, [TechID, TechLogID], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update technicianlog', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'TechnicianLog not found' });
        }
        res.status(200).json({ message: 'TechnicianLog updated' });
    });
};

/*export const deleteTechLog = (req, res) => {
    const { TechLogID } = req.params;

    const query = 'DELETE FROM TechniciansPresent WHERE TechLogID = ?';

    db.run(query, [TechLogID], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete technician', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Technician not found' });
        }
        res.status(200).json({ message: 'TechLog deleted' });
    });
}; */

export const deleteTechLog = (req, res) => {
    const { TechLogID } = req.params;

    const query = 'DELETE FROM TechniciansPresent WHERE TechLogID = ?';

    db.run(query, [TechLogID], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete technician', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Technician not found' });
        }
        res.status(200).json({ message: 'TechLog deleted' });
    });
}; 
export const GetCustomerSR = async (req, res) => {
    try {
        const CustomerID = req.params.CustomerID;
        console.log('Running GetCustomerSR');
        console.log('CustomerID:', CustomerID);

        const getServiceReportsQuery = `
            SELECT * FROM ServiceReport WHERE CustomerID = ?;
        `;

        console.log('Query constructed:', getServiceReportsQuery);

        // Fetch service reports from the database
        const serviceReports = await new Promise((resolve, reject) => {
            db.all(getServiceReportsQuery, [CustomerID], (err, rows) => {
                if (err) {
                    console.error('Database error:', err.message);
                    reject({ error: 'Failed to fetch service reports', details: err.message });
                } else {
                    console.log('Query result:', rows);
                    resolve(rows);
                }
            });
        });

        // Handle case where no service reports are found
        if (serviceReports.length === 0) {
            console.log('No service reports found for CustomerID:', CustomerID);
            res.status(200).json([]); // Return an empty array with a 200 status
            return;
        }
    
        // If service reports are found, return them
        res.status(200).json(serviceReports);
    } catch (error) {
        console.error('Error in GetCustomerSR:', error);
        res.status(500).json({ error: 'An error occurred while fetching service reports' });
    }
};

export const DeleteCustomerSR = async (req, res) => {
    try {
        const CustomerID = req.params.CustomerID;
        console.log('Deleting CustomerSR');
        console.log('CustomerID:', CustomerID);

        const deleteServiceReportsByCustomerIDQuery = `
            DELETE FROM ServiceReport WHERE CustomerID = ?;
        `;

        const deleteResult = await new Promise((resolve, reject) => {
            db.run(deleteServiceReportsByCustomerIDQuery, [CustomerID], function(err) {
                if (err) {
                    console.error('Database error:', err.message);
                    reject({ error: 'Failed to delete service reports', details: err.message });
                } else {
                    console.log('Deleted rows:', this.changes);  // `this.changes` contains the number of deleted rows
                    resolve(this.changes);  // Return the number of rows deleted
                }
            });
        });

        // If no rows were deleted, notify the user
        if (deleteResult === 0) {
            console.log('No service reports found for CustomerID:', CustomerID);
            return res.status(404).json({ message: 'No service reports found for the given customer.' });
        }

        // Successfully deleted service reports
        res.status(200).json({ message: `${deleteResult} service report(s) deleted successfully.` });
    } catch (error) {
        console.error('Error in DeleteCustomerSR:', error);
        res.status(500).json({ error: 'An error occurred while deleting service reports' });
    }
};
export const GetChemsFromSR = async (req, res) => {
    try {
        const srID = req.params.srID;
        console.log('Running Getting chems from SR');
        console.log('srID:', srID);

        const getSRUsageQuery = `
            SELECT * FROM SRChemUsage WHERE srID = ?;
        `;

        console.log('Query constructed:', getSRUsageQuery);

        // Fetch chemical usage data from the database
        const chemUsage = await new Promise((resolve, reject) => {
            db.all(getSRUsageQuery, [srID], (err, rows) => {
                if (err) {
                    console.error('Database error:', err.message);
                    reject({ error: 'Failed to fetch chemical usage', details: err.message });
                } else {
                    console.log('Query result:', rows);
                    resolve(rows);
                }
            });
        });

        // Handle case where no chemical usage is found
        if (chemUsage.length === 0) {
            console.log('No chemical usage found for srID:', srID);
            res.status(200).json([]); // Return an empty array with a 200 status
            return;
        }

        // Return the fetched chemical usage data
        res.status(200).json(chemUsage);
    } catch (error) {
        console.error('Error in GetChemsFromSR:', error);
        res.status(500).json({ error: 'An error occurred while fetching chemical usage' });
    }
};

export const GetServiceReportsByAddress = async (req, res) => {
    try {
        const { CustAddID } = req.params;

        if (!CustAddID) {
            return res.status(400).json({ error: 'CustAddID is required' });
        }

        console.log('Fetching Service Reports for Address:', CustAddID);

        const getReportsQuery = `
            SELECT * FROM ServiceReport WHERE CustAddID = ?;
        `;

        const serviceReports = await new Promise((resolve, reject) => {
            db.all(getReportsQuery, [CustAddID], (err, rows) => {
                if (err) {
                    console.error('Database error:', err.message);
                    reject({ error: 'Failed to fetch service reports', details: err.message });
                } else {
                    resolve(rows);
                }
            });
        });

        res.status(200).json(serviceReports);
    } catch (error) {
        console.error('Error in GetServiceReportsByAddress:', error);
        res.status(500).json({ error: 'An error occurred while fetching service reports' });
    }
};

export const DeleteChemLogsBySRID = (req, res) => {
    const { srID } = req.params;

    if (!srID) {
        return res.status(400).json({ error: 'srID is required' });
    }

    const query = 'DELETE FROM SRchemUsage WHERE srID = ?';

    db.run(query, [srID], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete ChemLogs', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'No ChemLogs found for the given srID' });
        }
        res.status(200).json({ message: 'ChemLogs deleted successfully' });
    });
};
