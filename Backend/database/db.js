import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config();
sqlite3.verbose();



const dbPath = resolve(process.env.DB_PATH); 
console.log('SERVERFILE:', dbPath);


const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('db.js: Connected to SQLite database.');
  }
});

export default db;

