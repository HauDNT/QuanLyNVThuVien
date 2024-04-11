const express = require('express');
const router = express.Router();
const BillsController = require('../controllers/BillsController');

router.get('/all', BillsController.getAllBills);
router.get('/:type', BillsController.getBillOfType);

module.exports = router;