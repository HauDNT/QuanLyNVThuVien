const express = require('express');
const router = express.Router();
const BillsController = require('../controllers/BillsController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/all', BillsController.getAllBills);
router.get('/amount', BillsController.countAmountOfBills);
router.get('/gettypes', BillsController.getTypes);
router.get('/:type', BillsController.getBillOfType);
router.post('/createbill', validToken, BillsController.createBill);
router.delete('/deletebill/:id', validToken, BillsController.deleteBill);
router.get('/trash/:type', BillsController.getBillSoftDeleted);

module.exports = router;