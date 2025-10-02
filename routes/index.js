const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');

// User routes
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/id/:id', userController.getUserById);
router.get('/users/username/:username', userController.getUserByUsername);
router.delete('/users/:id', userController.deleteUser);
router.post('/users/update-status', userController.updateUserStatus);
router.post('/users/update-role', userController.updateUserRole);

// Role routes
router.post('/roles', roleController.createRole);
router.get('/roles', roleController.getAllRoles);
router.get('/roles/:id', roleController.getRoleById);
router.delete('/roles/:id', roleController.deleteRole);


module.exports = router;