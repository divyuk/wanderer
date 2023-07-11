const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const rateLimit = require('express-rate-limit');
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

// Rate Limiter GLobal Middleware
// Limiter is middleware function
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many  reques try again later',
});

// Apply the rate limiting middleware to all requests
app.use('/api', limiter);

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
