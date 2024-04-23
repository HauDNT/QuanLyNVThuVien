const express = require('express');
const router = express.Router();
const ApproveController = require('../controllers/ApproveController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/get/:id', validToken, ApproveController.getApprove);
router.post('/create/:id', validToken, ApproveController.createApprove);
router.post('/findexist', validToken, ApproveController.findExist);

module.exports = router;