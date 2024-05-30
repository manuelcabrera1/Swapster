var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session')
var env = require('dotenv').config();
var stripe = require('stripe')
var indexRouter = require('./routes/index');
var mongooseRouter = require('./routes/mongoose');
var productoRouter = require('./routes/producto');
var usuarioRouter = require('./routes/usuario')
var paymentRouter = require('./routes/pago')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
  {
    secret:'secreto',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }));


app.use('/', indexRouter);
app.use('/mongoose', mongooseRouter);
app.use('/api/producto', productoRouter);
app.use('/api/usuario', usuarioRouter);
app.use('/api/payment', paymentRouter);

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
