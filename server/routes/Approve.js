const express = require('express');
const router = express.Router();
const ApproveController = require('../controllers/ApproveController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.post('/create/:id', ApproveController.createApprove);

module.exports = router;