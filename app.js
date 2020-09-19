const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const indexRoutes = require("./routes/index");
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");

var User = require("./models/user");
const seedDB = require("./seed.js");
// seedDB();

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelpcamp";
mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "Sheru wins the cutest dog award",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });

// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Mountain Goat's Rest",
//     image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.Ek2k2GXYdgDs-wNrV3w94gHaFj%26pid%3DApi&f=1",
//     description: "This is a campground on mountain. Have everything - water, bathroom, etc."
// }, (err, campground) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Newly created Campgrounds");
//         console.log(campground);
//     }
// });

app.listen(3000, () => {
    console.log("YelpCamp Server has started.");
});