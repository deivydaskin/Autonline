var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res){
    res.render('landing');
});

app.listen('3000');