const express = require('express');
const router = express.Router();
const BillsController = require('../controllers/BillsController');

router.get('/', BillsController.getAllBills);
router.get('/test', BillsController.getReceiveBills);
router.get('/receive');
router.get('/order');

module.exports = router;