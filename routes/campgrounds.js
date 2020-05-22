let express = require('express'),
	router	= express.Router(),
	Campground = require('../models/campground')
	middleware = require('../middleware');

router.get('/', function(req, res){
	//Get all campground from the DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds});

		}
	});
});

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res){
		//get data from the form and add to camps array
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = {name: name, price: price, image: image, description: desc, author: author};
	// Create a new campground and save it to the DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			console.log(newlyCreated)
			// redirect back to the campgrounds page
		res.redirect('/campgrounds');
		}
	});
	//redirect to campgrounds page
});

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('campgrounds/new')
});

// SHOW 
router.get('/:id', function(req, res){
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
	
});

// EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundsOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){ 
		res.render('campgrounds/edit', {campground: foundCampground}) //pass campground found by ID
	});
});

// UPDATE campground route
router.put('/:id', middleware.checkCampgroundsOwnership, function(req, res){
	// find and update the correct campground & redirect
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id)
		}
	})
});
// DESTROY campground route
router.delete('/:id', middleware.checkCampgroundsOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'You have removed the campground ('+ Campground.name + ')')
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;