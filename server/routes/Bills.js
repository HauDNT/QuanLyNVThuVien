const express = require('express');
const router = express.Router();
const BillsController = require('../controllers/BillsController');
const {validToken} = require('../middlewares/AuthenMiddlewares')

router.get('/all', BillsController.getAllBills);
router.get('/:type', BillsController.getBillOfType);
router.post('/createbill', validToken, BillsController.createBill);

module.exports = router;