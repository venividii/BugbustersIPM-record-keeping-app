import express from 'express';
import { createEmployeeAccount, getAllData } from '../controllers/dataController.js';

const router = express.Router();

router.get('/data', getAllData);

router.post('/data', createEmployeeAccount);

export default router;
