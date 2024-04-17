const express = require('express');
const router = express.Router();
const PositionsController = require('../controllers/PositionsController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/all', PositionsController.getAllPositions);

module.exports = router;