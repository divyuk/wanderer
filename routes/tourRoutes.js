const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router(); //Defining our own ROUTE

/* This is middleware for tourroute when id is specidfied if not this doesnt works.
No matter what the route is, this is going to run as this middleware is specified before
and order matter.*/
// router.param('id' , (req,res,next,val)=>{
//     console.log(`Tour id is ${val}`);
//     next();
// })

// router.param('id', tourController.checkID);

// Routes for other HTTP requests
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); // passes 1st from checkBody middleware then to createTour middleware.

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
