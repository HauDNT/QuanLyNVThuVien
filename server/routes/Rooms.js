const express = require('express');
const router = express.Router();
const RoomsController = require('../controllers/RoomsController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/all', RoomsController.getAllRooms);

module.exports = router;