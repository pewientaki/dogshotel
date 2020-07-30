let express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user')

router.get("/", function (req, res) {
	res.render('landing');
});
router.get('/register', function (req, res) {
	res.render('register');
});
// handle sign up logic
router.post('/register', function (req, res) {
	let newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			req.flash('error', err.message)
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function () {
			req.flash('success', 'Welcome to YelpCamp, ' + user.username)
			res.redirect('/hotels');
		});
	});
});

// show login form
router.get('/login', function (req, res) {
	res.render('login');
});
// handling login logic
router.post('/login', passport.authenticate('local',
	{
		successRedirect: '/hotels',
		failureRedirect: '/login'
	}), function (req, res) {

	});

// logout logic
router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success', 'Logged you out!');
	res.redirect('/hotels');
});

module.exports = router;