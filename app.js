const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('connect-flash'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	Hotel = require('./models/hotel'),
	Comment = require('./models/comment'),
	User = require('./models/user');

// requiring routes
let commentRoutes = require('./routes/comments'),
	hotelsRoutes = require('./routes/hotels'),
	authRoutes = require('./routes/auth');

mongoose.connect(
	'mongodb+srv://krystian:pleasedonttouch@dogshotel.wramt.mongodb.net/dogshotel?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIG ====
app.use(
	require('express-session')({
		secret: 'Spring rolls are amazing',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass user info on all routes ===========================
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(authRoutes);
app.use('/hotels/:id/comments', commentRoutes);
app.use('/hotels', hotelsRoutes);

var port = process.env.PORT || 8080;

var server = app.listen(port, function() {
	console.log('app running on port 8080');
});
