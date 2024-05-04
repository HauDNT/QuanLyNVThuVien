const express = require('express');
const router = express.Router();
const {validToken} = require('../middlewares/AuthenMiddlewares');
const BooksController = require('../controllers/BooksController');

router.get('/amount', BooksController.getAmountOfBooks);
router.get('/someInfo', BooksController.getSomeInfo);
router.get('/getInfoCatalog/:id', BooksController.getInfoCataloging);
router.get('/getAccessCatalog', BooksController.accessCataloging);
router.get('/getNotAccessCatalog', BooksController.notAccessCataloging);
router.get('/getPerMonth/:year', BooksController.getAmountPerMonthOfYear);
router.get('/encodetitles', BooksController.getEncodeTitles);
router.post('/search', validToken, BooksController.searchCataloging);
router.post('/createCataloging', validToken, BooksController.createCataloging);
router.put('/updateCataloging/:id', validToken, BooksController.updateCataloging);
router.delete('/deleteCataloging/:id', BooksController.deleteCataloging);

module.exports = router;