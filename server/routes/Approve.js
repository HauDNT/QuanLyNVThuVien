const express = require('express');
const router = express.Router();
const ApproveController = require('../controllers/ApproveController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/getall', ApproveController.getAll);
router.get('/getmaxregiscode', ApproveController.getMaxRegisCode);
router.get('/get/:bookId', validToken, ApproveController.getApprove);
router.post('/create/:id', validToken, ApproveController.createApprove);
router.post('/findexist', validToken, ApproveController.findExist);
router.delete('/delete/:id', validToken, ApproveController.deleteApprove);
router.patch('/accept/:bookId', ApproveController.acceptApprove);

module.exports = router;