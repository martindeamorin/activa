var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dashboardRouter = require('./routes/system/dashboard');
var usersRouter = require('./routes/system/users');
var landingRouter = require('./routes/landing/landing');
const globalMiddleware = require("./middlewares/system/globalMiddleware")
const session = require('express-session');
const cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'ZxioPAhTr4'}));
app.use(globalMiddleware.sessionRecovery)
app.use(globalMiddleware.setHeader)

//cors  
app.use(cors());

app.use('/dashboard', dashboardRouter);
app.use('/', usersRouter);
app.use('/', landingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
