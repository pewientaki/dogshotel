let express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
let passport = require('passport');
let flash = require('connect-flash');
let LocalStrategy = require('passport-local');
let methodOverride = require('method-override');
let Campground = require('./models/campground');
let Comment = require('./models/comment');
let User = require('./models/user');
let seedDB = require('./seeds');

// requiring routes
let commentRoutes 	  = require('./routes/comments'),
	campgroundsRoutes = require('./routes/campgrounds'),
	authRoutes  	  = require('./routes/auth')

// mongoose.connect('mongodb://localhost:27017/yelp_camp_11', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://pewientaki:yalla@cluster0-pzztc.mongodb.net/test?retryWrites=true&w=majority',

 {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); // seed the database

// PASSPORT CONFIG ====
app.use(require('express-session')({
	secret: 'Spring rolls are amazing',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass user info on all routes ===========================
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(authRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundsRoutes);

// app.listen(3000, function(){console.log("YelpCamp server v11 has started!")});
var port = process.env.PORT || 8080;

var server=app.listen(port,function() {
	console.log("app running on port 8080"); });