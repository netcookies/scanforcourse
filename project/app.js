var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var debug = require('debug')('classhelper:app');

module.exports = function(db) {
	var index = require('./routes/index')(db);
	var user = require('./routes/user')(db);
	var qrsign = require('./routes/qrsign')(db);
	var course = require('./routes/course')(db);

	var app = express();

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'pug');

	// uncomment after placing your favicon in /public
	app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(session({
		store: new MongoStore({
			url: 'mongodb://127.0.0.1:27017/classhelper'
		}),
		resave: true,
		saveUninitialized: true,
		secret: 'baoanj de classhelper'
	}));

	app.use('/', index);
	app.use('/user', user);
	app.use('/qr', qrsign);
	app.use('/course',course);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
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

	return app;

};