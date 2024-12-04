
import express from 'express';
import dotenv from 'dotenv';
import dataRoutes from './routes/dataroutes.js';

import cors from 'cors';


// Load environment variables

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT;

// Routes
app.use(express.json());
app.use(cors());
app.use('/api', dataRoutes); // Mount all routes under '/api'

app.get('/', (_req, res) => {
    res.send('Welcome to the Bugbusters API!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('DB_PATH:',process.env.DB_PATH); // Log the value to check if it's being loaded correctly

});
