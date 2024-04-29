const express = require('express');
const router = express.Router();
const {validToken} = require('../middlewares/AuthenMiddlewares');
const BooksController = require('../controllers/BooksController');

router.get('/someInfo', validToken, BooksController.getSomeInfo);
router.get('/getInfoCatalog/:id', validToken, BooksController.getInfoCataloging);
router.get('/getAccessCatalog', validToken, BooksController.accessCataloging);
router.get('/getNotAccessCatalog', validToken, BooksController.notAccessCataloging);
router.get('/encodetitles', BooksController.getEncodeTitles);
router.post('/search', validToken, BooksController.searchCataloging);
router.post('/createCataloging', validToken, BooksController.createCataloging);
router.put('/updateCataloging/:id', validToken, BooksController.updateCataloging);

module.exports = router;