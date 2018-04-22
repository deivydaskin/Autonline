var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    paths = require('./paths.js'),
    passport = require('passport'),
    localStrategy = require('passport-local');
    Car = require('./models/car');

var User = require('./models/user')
mongoose.connect('mongodb://autonline:6xMWwrVyIn6CTsyy@cluster0-shard-00-00-f6idp.mongodb.net:27017,cluster0-shard-00-01-f6idp.mongodb.net:27017,cluster0-shard-00-02-f6idp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('assets'));

//Passport Config
app.use(require('express-session')({
    secret: "autonlineSecretPhrase",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})
//------

/** ===========
 * AUTH ROUTES
  ==============*/
//Registration form
app.get(paths.registerForm, function (req,res){
    res.render('registerForm');
})

//Hangle registration logic
app.post(paths.registerForm, function (req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            return res.render('registerForm');
            
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        })
    });
})

//Login form
app.get(paths.loginForm, function (req, res){
    res.render('loginForm');
})

//Handle login logic
app.post(paths.loginForm, passport.authenticate('local',
{successRedirect: '/', failureRedirect: paths.loginForm}), function (req, res){
    
});

//Logout Route
app.get('/user/logout', function (req, res){
    req.logout();
    res.redirect('/');
})

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/login');
}

/**
 * AUTH END
 */


app.get('/', function (req, res){
    res.render('landing');
});

app.get(paths.cars.new, function (req, res){
    res.render('carsNew');
});

app.post(paths.cars.new, function (req, res){
    Car.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }, function (err, done){
        if (err){
            console.log("Error");
        }
        else {
            console.log("Done");
            res.redirect('/');
        }
    })
});

app.post(paths.cars.search, function (req, res){
    Car.find({
        name: req.body.name,
    }, function (err, done){
        if (err){
            console.log("Error");
        }
        else {
            console.log(done);
            res.render('search', {cars: done});
        }});
    });


app.listen('3000');