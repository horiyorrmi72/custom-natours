const express = require('express');
const authController = require('../controllers/authController');
const handleError = require('../controllers/errorController');
const router = express();
router.use(handleError);

router.post('/signup', authController.signup);
router.post('/login' ,authController.signin);
router.post('/forgotPassword');
router.post('/resetPassword');

module.exports = router;
