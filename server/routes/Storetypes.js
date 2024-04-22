const express = require('express');
const router = express.Router();
const StoretypesController = require('../controllers/StoretypesController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/', StoretypesController.getStoreTypes);

module.exports = router;