var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var ueditor = require('ueditor');

var compression = require('compression');//静态资源压缩中间件，支持deflate和gzip

var settings = require('./settings');

var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
// var multer = require('multer');

var index = require('./routes/index');
var heapot = require('./routes/heapot');
var sijiache = require('./routes/sijiache');
var utils = require('./routes/utils');
var editor = require('./routes/editor');

var app = express();

// app.use(multer({dest: './public/upload'}));

// view engine setup
app.set('views', [path.join(__dirname, 'views')]);
app.set('view engine', 'ejs');



app.use(compression());
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
// app.use(cookieParser());

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 2},//2 hours
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: settings.url
  })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/heapot', heapot);
app.use('/utils', utils);
app.use('/sijiache', sijiache);
app.use('/editor', editor);
app.use('/ueditor/upload', ueditor(path.join(__dirname, 'public'), function(req, res, next){
  if(req.query.action === 'uploadimage'){
    var foo = req.ueditor;
    var date = new Date();
    var imgname = req.ueditor.filename;

    var img_url = '/upload/ueditor/';
    res.ue_up(img_url);
  }else if(req.query.action === 'listimage'){
    var dir_url = '/upload/ueditor/';
    res.ue_list(dir_url);
  }else{
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/ueditor.config.json')
  }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
