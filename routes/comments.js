let express = require('express'),
	router = express.Router({ mergeParams: true }),
	Hotel = require('../models/hotel'),
	Comment = require('../models/comment');
middleware = require('../middleware');


// NEW - show the form
router.get('/new', middleware.isLoggedIn, function (req, res) {
	// find campg by id
	Hotel.findById(req.params.id, function (err, hotel) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { hotel: hotel });
		}
	});
})

// CREATE - add a new comment to the DB
router.post('/', middleware.isLoggedIn, function (req, res) {
	// find camp by ID
	Hotel.findById(req.params.id, function (err, hotel) {
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					req.flash('error', 'Something went wrong..')
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();

					hotel.comments.push(comment);
					hotel.save();
					req.flash('success', 'Successfully added comment')
					res.redirect('/hotels/' + hotel._id);
				}
			});
		}
	})
});

// EDIT - show the edit template
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
	Comment.findById(req.params.comment_id, function (err, foundComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { hotel_id: req.params.id, comment: foundComment });

		}
	});
});

// UPDATE - change the comment
router.put('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/hotels/' + req.params.id);
		}
	});
});

//DESTROY comment route
router.delete('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
	Comment.findOneAndRemove(req.params.comment_id, function (err) {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted')
			res.redirect('/hotels/' + req.params.id);
		}
	});
});

module.exports = router;