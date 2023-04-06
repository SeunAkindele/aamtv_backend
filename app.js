const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const videoRouter = require('./routes/videoRoutes');
const userRouter = require('./routes/userRoutes');

// Initializes express
const app = express();

// Protection
app.use(helmet());

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 15,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requets from this IP, please try again in an hour!'
});

// Limits number of requests to use router withing a time frame of 1hr
// app.use('/api/v1/users', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data parser, reading data from body into req.body
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    // express automatically see a next with parameter as an error, and then jumps all the middleware to the error middleware

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;