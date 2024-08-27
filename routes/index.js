const express = require('express');
const userRoute = require('./usersRoutes');
const authRoute = require('./authRoute');
const tourRoute = require('./tourRoutes');
const bookingRoute = require('./bookingRoutes');

const router = express();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/tour', tourRoute);
router.use('/booking', bookingRoute);

module.exports = router;
