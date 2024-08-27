const express = require('express');
const tourController = require('../controllers/tourController');
const router = express();
const AppError = require('../utils/appError.utils');

router.get('/getTour/:id', tourController.getTourById);
router.get('/getTours', tourController.getTours);
router.post('/createTour', tourController.createTour);
router.patch('/updateTour/:id', tourController.updateTour);
router.delete('/deleteTour/:id', tourController.deleteTour);

module.exports = router;
