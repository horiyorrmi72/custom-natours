const express = require('express');
const authController = require('../controllers/authController');
const router = express();

router.post('/signup', authController.signup);
router.post('/login' ,authController.signin);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword');

module.exports = router;
