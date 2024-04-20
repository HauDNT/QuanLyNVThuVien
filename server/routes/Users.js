const express = require('express');
const router = express.Router();
const {validToken} = require('../middlewares/AuthenMiddlewares');
const UsersController = require('../controllers/UsersController');

router.get('/', UsersController.findAllUsers);
router.post('/login', UsersController.login);
router.get('/info/:id', UsersController.findInfoUser);
router.post('/register', UsersController.register);
router.post('/createinfo', validToken, UsersController.createInfoUser);
router.delete('/delete/:id', validToken, UsersController.deleteAccount);
router.get('/trash', UsersController.getAccountSoftDeleted);
router.patch('/trash/restore/:id', UsersController.restoreEachAccount);
router.delete('/trash/delete/:id', validToken, UsersController.forceDeleteAccount);

module.exports = router;