const path = require('path');
const express = require('express');
const cors = require('cors');
//
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const hpp = require('hpp');

//for passing the cookies during every request
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//this is the middleware for assessing file in the folder that dont have a server route (serving static files)
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
//   res.header('Access-control-Allow-Origin', '*');
//   res.header(
//     'Access-control-Allow-Headers',
//     'Origin,X-requested-With,Content-type,Accept'
//   );
//   next();
// });
app.use(
  cors({
    origin: 'http://localhost:8000',
    credentials: true,
  })
);

// set security http headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': ["'self'"],
        'style-src': null,
      },
      reportOnly: true,
    },
  })
);

// app.use(function (req, res, next) {
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self'http://127.0.0.1:8000/api/v1/users/login'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
//   );
//   next();
// });
// console.log(helmet());

const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const bookingRouter = require('./Routes/bookingRoutes');
const viewRouter = require('./Routes/viewRoutes');

// GLOBAL MIDDLEWEARS

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit requests from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//cookie parser being used
app.use(cookieParser());

// data sanitization against noSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
// app.use(xss());
var html = xss('<script>alert("xss")</script>');

// console.log('==========================');
// console.log(html);

console.log('-------------------');
console.log('-------------------');
// console.log(xss());
// console.log('-------------------');

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('this is the test middleware');
  next();
});
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//for any other type of error thats not in the route
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`
  // });
  //   const err = new Error(`Can't find ${req.originalUrl} on this server`);
  //   err.status = 'fail';
  //   err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
