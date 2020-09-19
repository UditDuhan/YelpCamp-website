const express = require("express");
const router = express.Router();
const passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "You are signed in as " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Login routes-------------
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: "Invalid Username or password",
    successFlash: "You are now logged in"
}), (req, res) => {

});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out...");
    res.redirect("/campgrounds");
});

module.exports = router;