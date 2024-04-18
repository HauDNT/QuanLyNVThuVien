const express = require('express');
const router = express.Router();
const {validToken} = require('../middlewares/AuthenMiddlewares');
const UsersController = require('../controllers/UsersController');

router.get('/', UsersController.findAllUsers);
router.post('/login', UsersController.login);
router.post('/register', UsersController.register);
router.post('/createinfo', UsersController.createInfoUser);
router.delete('/delete/:id', validToken, UsersController.deleteAccount);

module.exports = router;