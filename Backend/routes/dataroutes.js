import express from 'express';

import { createEmployeeAccount, getAllEmployees,getEmployeeById,deleteEmployee,updateEmployee,Login,} from '../controllers/EmployeeController.js';
import { checkNumber,CreateCustomerProfile, deleteCustomer, updateCustomer,getAllCustomers,GetCustomerById, CreateCustomerAddress,ReadCustomerAddress,UpdateCustomerAddress,DeleteCustomerAddress, LogQuoteChems, GetQuoteChemLog,DeleteQChemLog,UpdateQChemLog,CreateQuotation,GetQuotation,DeleteQuotation,UpdateQuotation,DeleteCustomerAddresses} from '../controllers/CustomerController.js';
import {CreateServiceReport,deleteSR,GetSRbyID,updateSR,LogChems,/*GetChemLogbyID,*/DeleteChemLog,UpdateChemLog,createTechLog,getTechLog,updateTechLog,deleteTechLog,GetCustomerSR,DeleteCustomerSR,GetChemsFromSR,GetServiceReportsByAddress,DeleteChemLogsBySRID} from '../controllers/SRController.js';
//,getTechLog,updateTechLog,deleteTechLog}w
const router = express.Router();


router.post('/employee', createEmployeeAccount);
router.get('/employee', getAllEmployees); 
router.delete('/employee/:EmployeeID', deleteEmployee);
router.get('/employee/:id', getEmployeeById); 
router.put('/employee/:EmployeeID', updateEmployee);

router.post('/login', Login);

router.post('/customer',CreateCustomerProfile);
router.get('/customer', getAllCustomers);
router.delete('/customer/:CustomerID', deleteCustomer);
router.get('/customer/:CustomerID',GetCustomerById); 
router.put('/customer/:CustomerID', updateCustomer);
router.get('/customer/exists/:CContact',checkNumber);

router.post('/customer/address',CreateCustomerAddress);
router.delete('/customer/address/:CustAddID', DeleteCustomerAddress);
router.get('/customer/address/:CustAddID', ReadCustomerAddress); 
router.put('/customer/address/:CustAddID', UpdateCustomerAddress);
router.delete('/customer/address/all/:CustomerID', DeleteCustomerAddresses);



router.post('/customer/address/quote',CreateQuotation);
router.get('/customer/address/quote/:QuotationID', GetQuotation);
router.delete('/customer/address/quote/:QuotationChemsID',DeleteQuotation); 
router.put('/customer/address/quote/:QuotationChemsID', UpdateQuotation);


router.post('/customer/address/Qchems',LogQuoteChems);
router.get('/customer/address/Qchems/:QuotationID', GetQuoteChemLog);
router.delete('/customer/address/Qchems/:QuotationChemsID',DeleteQChemLog); 
router.put('/customer/address/Qchems/:QuotationChemsID', UpdateQChemLog);

router.get('/SR/all/:CustomerID',GetCustomerSR);
router.get('/SR/address/:CustomerAddID,GetAddresses');
router.post('/SR',CreateServiceReport);
router.delete('/SR/:srID', deleteSR);
router.put('/SR/:srID', updateSR);
router.get('/SR/:srID', GetSRbyID);
router.get('/SR/address/:CustAddID',GetServiceReportsByAddress);

//router.get('/SR/SRChems/:SRChemUsageID', GetChemLogbyID); 
router.post('/SR/SRChems',LogChems);
router.delete('/SR/SRChems/:SRChemUsageID', DeleteChemLog);
router.put('/SR/SRChems/:SRChemUsageID', UpdateChemLog);
router.get('/SR/SRChems/:srID',GetChemsFromSR);
router.delete('/SR/SRChems/SRID/:srID', DeleteChemLogsBySRID);


router.post('/SR/tech', createTechLog);
router.get('/SR/tech/:TechLogID', getTechLog);//
router.put('/SR/tech/:TechLogID', updateTechLog);
router.delete('/SR/tech/:TechLogID', deleteTechLog);
router.delete('/SR/all/:CustomerID', DeleteCustomerSR);
router.get('SR/ALL')

//router.delete('/SR/chems/all/:serviceReportId',deleteSRchemUsageByServiceReportIDs );

export default router;
