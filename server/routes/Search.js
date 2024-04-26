const express = require('express');
const router = express.Router();
const {validToken} = require('../middlewares/AuthenMiddlewares');
const SearchController = require('../controllers/SearchController');

router.post('/', validToken, SearchController.search);

module.exports = router;