import sqlite3 from 'sqlite3';
import db from '../database/db.js';  

sqlite3.verbose();
import dotenv from 'dotenv';
dotenv.config();

//Create an employee function
export const createEmployeeAccount = (req, res) => {
    console.log('Request Body:', req.body); 

    const {FirstName,LastName,PhoneNumber,Username,Role,Password } = req.body;
    if (!FirstName||!LastName|| !Username || !Password ||!Role||!PhoneNumber) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    const query = 'INSERT INTO Employee(FirstName,LastName,PhoneNumber,Username,Role,Password) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.run(query, [FirstName,LastName,PhoneNumber,Username,Role,Password], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create Employee', details: err.message });
      }
      res.status(201).json({ message: 'Employee created', Employeeid: this.lastID });
    });
  };
//Retrieve all employees function
export const getAllEmployees= (req, res) => {
  const query = `
    SELECT 
      EmployeeID, 
      FirstName, 
      LastName, 
      PhoneNumber, 
      Username, 
      Role, 
      Password 
    FROM 
      Employee
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching employees:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch employees',
        details: err.message,
      });
    }

    res.json(rows);
  });
};

export const getEmployeeById = (req, res) => {
  const employeeID = req.params.id;

  const query = `
    SELECT 
      EmployeeID, 
      FirstName, 
      LastName, 
      PhoneNumber, 
      Username, 
      Role, 
      Password 
    FROM 
      Employee
    WHERE 
      EmployeeID = ?
  `;

  db.get(query, [employeeID], (err, row) => {
    if (err) {
      console.error('Error fetching employee:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch employee',
        details: err.message,
      });
    }

    if (!row) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(row);
  });
};

//Delete Employee function
export const deleteEmployee = (req, res) => {
  const { EmployeeID } = req.params;

  if (!EmployeeID) {
      return res.status(400).json({ error: 'EmployeeID is required' });
  }

  const query = 'DELETE FROM Employee WHERE EmployeeID = ?';

  db.run(query, [EmployeeID], function (err) {
      if (err) {
          return res.status(500).json({ error: 'Failed to delete employee', details: err.message });
      }

      if (this.changes === 0) {
          return res.status(404).json({ error: 'Employee not found' });
      }

      res.status(200).json({ message: 'Employee deleted successfully' });
  });
};

//update
export const updateEmployee = (req, res) => {
  const { EmployeeID } = req.params; // Get the EmployeeID from the route parameter
  const { FirstName, LastName, PhoneNumber, Username, Role, Password } = req.body; // Get updated fields from the request body

  if (!EmployeeID) {
      return res.status(400).json({ error: 'EmployeeID is required' });
  }

  if (!FirstName && !LastName && !PhoneNumber && !Username && !Role && !Password) {
      return res.status(400).json({ error: 'At least one field to update is required' });
  }

  // Build the query dynamically based on the provided fields
  const fieldsToUpdate = [];
  const values = [];

  if (FirstName) {
      fieldsToUpdate.push('FirstName = ?');
      values.push(FirstName);
  }
  if (LastName) {
      fieldsToUpdate.push('LastName = ?');
      values.push(LastName);
  }
  if (PhoneNumber) {
      fieldsToUpdate.push('PhoneNumber = ?');
      values.push(PhoneNumber);
  }
  if (Username) {
      fieldsToUpdate.push('Username = ?');
      values.push(Username);
  }
  if (Role) {
      fieldsToUpdate.push('Role = ?');
      values.push(Role);
  }
  if (Password) {
      fieldsToUpdate.push('Password = ?');
      values.push(Password);
  }

  const query = `UPDATE Employee SET ${fieldsToUpdate.join(', ')} WHERE EmployeeID = ?`;
  values.push(EmployeeID);

  db.run(query, values, function (err) {
      if (err) {
          return res.status(500).json({ error: 'Failed to update employee', details: err.message });
      }

      if (this.changes === 0) {
          return res.status(404).json({ error: 'Employee not found' });
      }

      res.status(200).json({ message: 'Employee updated successfully' });
  });
};



