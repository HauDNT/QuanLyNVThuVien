const express = require('express');
const router = express.Router();
const StatusdocController = require('../controllers/StatusdocController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/', StatusdocController.getStatusDoc);

module.exports = router;