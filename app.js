const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./utils/errorHandler');
const viewRouter = require('./routes/view');
const userRouter = require('./routes/user');
const groupRouter = require('./routes/group');
const homeworkRouter = require('./routes/homework');
const fileRouter = require('./routes/file');
const AppError = require('./utils/appError');
const app = express();
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*', cors())

app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    })
  );
   
  // Further HELMET configuration for Security Policy (CSP)
  const scriptSrcUrls = [
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'https://*.cloudflare.com',
  ];
  const styleSrcUrls = [
    'https://api.mapbox.com/',
    'https://api.tiles.mapbox.com/',
    'https://fonts.googleapis.com/',
    'https://www.myfonts.com/fonts/radomir-tinkov/gilroy/*',
  ];
  const connectSrcUrls = [
    'https://*.mapbox.com/',
    'https://*.cloudflare.com',
    'http://127.0.0.1:4000',
    'ws://localhost:*/'
  ];
   
  const fontSrcUrls = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ];
   
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: ["'self'", 'blob:', 'data:'],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(express.json({limit:'10kb'}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());


app.use('/',viewRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/groups',groupRouter);
app.use('/api/v1/homework',homeworkRouter);
app.use('/api/v1/files',fileRouter);

app.all('*', (req, res, next) => {
    const error = new AppError('URL not found', 404);
    next(error);
});
app.use(errorHandler);


module.exports = app;