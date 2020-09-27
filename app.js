var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//connect to DB
mongoose.connect('mongodb://localhost/Artilces', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))
var db = mongoose.connection;

//init app
var app = express();
var PORT = 3000

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware for body parser//  
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
////////////

//set public folder as static
app.use(express.static(path.join(__dirname, "public")));

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
var Article = require('./models/article');
const { dirname } = require('path');

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
        title: 'Add Articles'
    })
});

//get single artilce route
app.get('/article/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('article', {
            article: article
        })
        return
    });
});

//load edit form
app.get('/article/edit/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('edit_article', {
            title: "Edit Article",
            article: article
        })
        return
    });
});


//add Submit POST ROUTE
app.post('/articles/add', function (req, res) {
    var article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/')
        }
    })
});


app.delete('/article/:id', function (req, res) {
    let query = { _id: req.params.id }
    Article.remove(query, function (err) {
        if (err) {
            console.log(err)
        };
        res.send("Success")
    })

})

//Update Submit POST ROUTE
app.post('/articles/edit/:id', function (req, res) {
    var article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    var query = { _id: req.params.id }

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/')
        }
    })
});

//start server
app.listen(PORT, function () {
    console.log('server running on port ' + PORT);
})