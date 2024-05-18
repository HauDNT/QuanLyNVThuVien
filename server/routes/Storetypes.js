const express = require('express');
const router = express.Router();
const StoretypesController = require('../controllers/StoretypesController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/', StoretypesController.getStoreTypes);
router.post('/addStoreType', validToken, StoretypesController.createStoreType);
router.delete('/deleteStoreType/:id', validToken, StoretypesController.deleteStoreType);

module.exports = router;