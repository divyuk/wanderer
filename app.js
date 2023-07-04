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

// Handling the Unhandled Routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find ${req.originalUrl} on this server`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || '500';
  err.status = err.status || 'fail';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app; // for single exports
