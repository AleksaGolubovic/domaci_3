const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/addUser', userController.addUser);
router.get('/getUser/:id', userController.getUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserPosts/:id', userController.getUserPosts);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/currentUser', userController.currentUser);

module.exports = router;
