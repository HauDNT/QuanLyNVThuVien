const express = require('express');
const router = express.Router();
const ApproveController = require('../controllers/ApproveController');
const {validToken} = require('../middlewares/AuthenMiddlewares');


module.exports = router;