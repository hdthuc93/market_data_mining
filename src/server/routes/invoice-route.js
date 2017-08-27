import express from 'express';
import invoiceCtrl from '../controllers/invoice-controller';


const router = express.Router();

router.route('/')
    .post(invoiceCtrl.createInvoice)
    
export default router;