const express = require('express');
const router = express.Router();
const ApproveController = require('../controllers/ApproveController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/getall', ApproveController.getAll);
router.get('/getmaxregiscode', ApproveController.getMaxRegisCode);
router.get('/item/:approveId', ApproveController.getInfoAnApprove);
router.get('/isnotaccept/:bookId', ApproveController.isNotAccept);
router.get('/get/:bookId', ApproveController.getApprove);
router.post('/searchInApprove', validToken, ApproveController.searchInApprove);
router.post('/create/:id', validToken, ApproveController.createApprove);
router.post('/findexist', validToken, ApproveController.findExist);
router.put('/update/:approveId', validToken, ApproveController.updateApprove);
router.patch('/accept/:bookId', ApproveController.acceptApprove);
router.delete('/delete/:id', validToken, ApproveController.deleteApprove);

module.exports = router;