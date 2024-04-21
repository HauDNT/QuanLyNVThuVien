const express = require('express');
const router = express.Router();
const {validToken} = require('../middlewares/AuthenMiddlewares');
const BooksController = require('../controllers/BooksController');

router.get('/someInfo', validToken, BooksController.getSomeInfo);
router.get('/getInfoCatalog/:id', validToken, BooksController.getInfoCataloging);
router.post('/createCataloging', validToken, BooksController.createCataloging);

module.exports = router;