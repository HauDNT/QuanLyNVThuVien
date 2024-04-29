const express = require('express');
const router = express.Router();
const {validToken} = require('../middlewares/AuthenMiddlewares');
const UsersController = require('../controllers/UsersController');

router.get('/all', UsersController.getAllUsers);
router.get('/info/:id', UsersController.getInfoAUser);
router.get('/fullname/:id', UsersController.getFullname);
router.get('/trash', UsersController.getAccountSoftDeleted);
router.post('/login', UsersController.login);
router.post('/register', UsersController.register);
router.post('/createinfo', validToken, UsersController.createInfoUser);
router.post('/search', validToken, UsersController.searchUser);
router.put('/updateinfo/:id', validToken, UsersController.updateAccount);
router.patch('/trash/restore/:id', UsersController.restoreEachAccount);
router.delete('/delete/:id', validToken, UsersController.deleteAccount);
router.delete('/trash/delete/:id', validToken, UsersController.forceDeleteAccount);

module.exports = router;