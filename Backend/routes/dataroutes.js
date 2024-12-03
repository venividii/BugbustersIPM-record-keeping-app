import express from 'express';
import { createEmployeeAccount, getAllEmployees,getEmployeeById,deleteEmployee,updateEmployee} from '../controllers/EmployeeController.js';
import { CreateCustomerProfile, deleteCustomer, updateCustomer,GetCustomerById, CreateCustomerAddress,ReadCustomerAddress,UpdateCustomerAddress,DeleteCustomerAddress, LogQuoteChems, GetQuoteChemLog,DeleteQChemLog,UpdateQChemLog,CreateQuotation,GetQuotation,DeleteQuotation,UpdateQuotation,} from '../controllers/CustomerController.js';
import { CreateServiceReport,deleteSR,GetSRbyID,updateSR,LogChems,GetChemLogbyID,DeleteChemLog,UpdateChemLog,createTechLog,getTechLog,updateTechLog,deleteTechLog} from '../controllers/SRController.js';
//,getTechLog,updateTechLog,deleteTechLog}
const router = express.Router();

router.post('/employee', createEmployeeAccount);
router.get('/employee', getAllEmployees); 
router.delete('/employee/:EmployeeID', deleteEmployee);
router.get('/employee/:id', getEmployeeById); 
router.put('/employee/:EmployeeID', updateEmployee);

router.post('/customer',CreateCustomerProfile);
router.delete('/customer/:CustomerID', deleteCustomer);
router.get('/customer/:id', GetCustomerById); 
router.put('/customer/:customerID', updateCustomer);

router.post('/customer/address',CreateCustomerAddress);
router.delete('/customer/address/:CustAddID', DeleteCustomerAddress);
router.get('/customer/address/:CustAddID', ReadCustomerAddress); 
router.put('/customer/address/:CustAddID', UpdateCustomerAddress);

router.post('/customer/address/quote',CreateQuotation);
router.get('/customer/address/quote/:QuotationID', GetQuotation);
router.delete('/customer/address/quote/:QuotationChemsID',DeleteQuotation); 
router.put('/customer/address/quote/:QuotationChemsID', UpdateQuotation);


router.post('/customer/address/Qchems',LogQuoteChems);
router.get('/customer/address/Qchems/:QuotationID', GetQuoteChemLog);
router.delete('/customer/address/Qchems/:QuotationChemsID',DeleteQChemLog); 
router.put('/customer/address/Qchems/:QuotationChemsID', UpdateQChemLog);


router.post('/SR',CreateServiceReport);
router.delete('/SR/:srID', deleteSR);
router.put('/SR/:srID', updateSR);
router.get('/SR/:srID', GetSRbyID);

router.get('/SR/SRChems/:SRChemUsageID', GetChemLogbyID); 
router.post('/SR/SRChems',LogChems);
router.delete('/SR/SRChems/:SRChemUsageID', DeleteChemLog);
router.put('/SR/SRChems/:SRChemUsageID', UpdateChemLog);

router.post('/SR/tech', createTechLog);
router.get('/SR/tech/:TechLogID', getTechLog);//
router.put('/SR/tech/:TechLogID', updateTechLog);
router.delete('/SR/tech/:TechLogID', deleteTechLog);



export default router;
