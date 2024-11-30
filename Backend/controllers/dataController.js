import sqlite3 from 'sqlite3';
import db from '../database/db.js';  

sqlite3.verbose();
import dotenv from 'dotenv';
dotenv.config();

  
export const getAllData = (req, res) => {
  const query = 'SELECT * FROM Employee';

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'F  ailed to fetch data', details: err.message });
    }
    res.json(rows);
  });
};

export const createEmployeeAccount = (req, res) => {
    console.log('Request Body:', req.body); // Log the incoming data

    const {FirstName,LastName,PhoneNumber,Username,Role,Password } = req.body;
    if (!FirstName|| !Username || !Password ||!Role) {
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
  
