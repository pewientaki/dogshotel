let Hotel = require('../models/hotel')
let Comment = require('../models/comment')

// all the middleware goes here
let middlewareObj = {};

middlewareObj.checkHotelsOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Hotel.findById(req.params.id, function (err, foundHotel) {
            if (err) {
                req.flash('error', 'Hotel not found :(')
                res.redirect("back");
            } else {
                // does user own the hotel?
                if (foundHotel.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do that')
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that')
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that')
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('/login');
};

module.exports = middlewareObj;