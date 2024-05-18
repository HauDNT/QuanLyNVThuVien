const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/RolesController');
const {validToken} = require('../middlewares/AuthenMiddlewares');

router.get('/getAllRoles', validToken, RolesController.getAllRoles);
router.get('/getRolePermissByUserId/:userId', validToken, RolesController.getRole_PermissByUserId);
router.post('/addRole', validToken, RolesController.createRole);
router.delete('/deleteRole/:id', validToken, RolesController.deleteRole)

module.exports = router;