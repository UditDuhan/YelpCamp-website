const express = require("express");
const router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
const middleware = require("../middleware/index");

router.get("/", (req, res) => {
    Campground.find({}, (err, allCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampground
            });
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: name,
        image: image,
        description: desc,
        price: price,
        author: author
    };
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.flash("success", "Campground added successfully");
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "Sorry, that campground doesn't exists");
            return res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground edited successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, removedCampground) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            Comment.deleteMany({
                _id: {
                    $in: removedCampground.comments
                }
            }, err => {
                if (err) {
                    console.log(err);
                } else {
                    req.flash("success", "Campground deleted");
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

module.exports = router;