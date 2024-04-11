const express = require('express');
const router = express.Router();
const {validToken} = require('../middlewares/AuthenMiddlewares');
const AuthenticateController = require('../controllers/AuthenticateController');

router.get('/verifyToken', validToken, AuthenticateController.verifyTokenUser);

module.exports = router;