const express = require('express'),
	router = express.Router(),
	Hotel = require('../models/hotel'),
	middleware = require('../middleware');

router.get('/', function(req, res) {
	//Get all hotels from the DB
	Hotel.find({}, function(err, allHotels) {
		if (err) {
			console.log(err);
		} else {
			res.render('hotels/index', { hotels: allHotels });
		}
	});
});

// CREATE - add new hotel to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
	//get data from the form and add to hotels array
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newHotel = { name: name, price: price, image: image, description: desc, author: author };
	// Create a new hotel and save it to the DB
	Hotel.create(newHotel, function(err, newlyCreated) {
		if (err) {
			req.flash('error', 'Something went wrong.. :(');
			console.log(err);
		} else {
			console.log(newlyCreated);
			// redirect back to the hotels page
			req.flash('success', 'You have added a new hotel, thank you!');
			res.redirect('/hotels');
		}
	});
});

// NEW - show form to create new hotels
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('hotels/new');
});

// SHOW
router.get('/:id', function(req, res) {
	Hotel.findById(req.params.id).populate('comments').exec(function(err, foundHotel) {
		if (err) {
			console.log(err);
		} else {
			res.render('hotels/show', { hotel: foundHotel });
		}
	});
});

// EDIT hotel route
router.get('/:id/edit', middleware.checkHotelsOwnership, function(req, res) {
	Hotel.findById(req.params.id, function(err, foundHotel) {
		//pass hotel data found by ID
		res.render('hotels/edit', { hotel: foundHotel }); 
	});
});

// UPDATE hotel route
router.put('/:id', middleware.checkHotelsOwnership, function(req, res) {
	// find and update the correct hotel & redirect
	Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err, updatedHotel) {
		if (err) {
			res.redirect('/hotels');
		} else {
			res.redirect('/hotels/' + req.params.id);
		}
	});
});
// DESTROY hotel route
router.delete('/:id', middleware.checkHotelsOwnership, function(req, res) {
	Hotel.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/hotels');
		} else {
			req.flash('success', 'You have removed the hotel (' + Hotel.name + ')');
			res.redirect('/hotels');
		}
	});
});

module.exports = router;
