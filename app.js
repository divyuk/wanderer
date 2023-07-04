const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utilis/appError');
const globalErrorHandler = require('./controllers/errorController');

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

// Handling the Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app; // for single exports
