const express = require('express');
const router = express.Router();
const {validToken} = require('../middlewares/AuthenMiddlewares');
const UsersController = require('../controllers/UsersController')

router.get('/', (req, res) => {res.send('Users page')});
router.post('/register', UsersController.register);

module.exports = router;