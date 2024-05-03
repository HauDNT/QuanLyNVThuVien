const express = require('express');
const router = express.Router();
const BillsController = require('../controllers/BillsController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/all', BillsController.getAllBills);    // Lấy toàn bộ hóa đơn
router.get('/amount', BillsController.countAmountOfBills);
router.get('/gettypes', BillsController.getTypes);
router.get('/getTotalPerMonth/:month/:year', BillsController.getTotalPerMonth);
router.get('/detail/:billId', BillsController.getBillDetail);
router.get('/trash/:type', BillsController.getBillSoftDeleted);
router.get('/:type', BillsController.getBillOfType);
router.post('/searchBills', validToken, BillsController.searchBills);
router.post('/searchBooksOfBill', validToken, BillsController.searchBooksOfBill);
router.post('/createbill', validToken, BillsController.createBill);
router.delete('/deletebill/:id', validToken, BillsController.deleteBill);
router.patch('/trash/restore/:id', BillsController.restoreReachBill);
router.delete('/trash/delete/:id', validToken, BillsController.forceDeleteBill);

module.exports = router;