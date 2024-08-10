const express = require('express');
const userController = require('../controllers/userControllers');
const AppError = require('../utils/appError');
const router = express();


router.get('/getUser/:id', userController.getUserById);
router.get('/getUsers', userController.getUsers);
router.patch('/updateUser/:id', userController.updateUserData);
router.patch('/updateme/:id', userController.updateUserData);
router.delete('/deleteUser/:id', userController.deleteUser);
router.delete('/deleteUsers', userController.deleteUsers);





module.exports = router;