const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utilis/appError');
const globalErrorHandler = require('./controllers/errorController');

// Calling express
const app = express();

//! Global Middleware

//1. Set Security HTTP headers
// Use Helmet!
app.use(helmet());

//2. Rate Limiter GLobal Middleware
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

//3.Body parse, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//4. Data Sanitization against NOSQL query Injection
app.use(mongoSanitize());
//5.  Data Sanitization against Cross
app.use(xss());

//6. Testing Purpose Middleware
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
