var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

//connect to DB
mongoose.connect('mongodb://localhost/Artilces', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))
var db = mongoose.connection;

//init app
var app = express();
var PORT = 3000



//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


///////////////////////////////////////
//check connection
db.once('open', function () {
    console.log("connected to MongoDB")
});
//check for db errors
db.on('error', function (err) {
    console.log(err);
});
///////////////////////////////////////

//bring in models
var Article = require('./models/article')

//home route
app.get('/', function (req, res) {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles,
            });
        }
    });
});

//add routes
app.get('/articles/add', function (req, res) {
    res.render('addArticle', {
        title: 'add'
    })
})

//start server
app.listen(PORT, function () {
    console.log('server running on port ' + PORT);
})