const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
//-------------------------//
//! Middleware -> the below 2 are required for all the routes
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

//------------------------//
// Mounting the Routers
//? tourRouter is a middleware
//? '/api/v1/tours' for this route we are applying tourRouter middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app; // for single exports
