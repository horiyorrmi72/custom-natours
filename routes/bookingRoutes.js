const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express();

router.get('/getBooking');
router.get('/getBookings');
router.post('/createBooking');
router.patch('/updateBooking');
router.delete('/deleteBooking');

module.exports = router;
