const express = require('express');
const mongoose = require('mongoose');

require('./db');
const session = require('express-session');
const path = require('path');
const auth = require('./auth.js');

const app = express();

// register schemas
const Article = mongoose.model('Article');
const User = mongoose.model('User');

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));

// add authentication middleware
app.use((req, res, next) => {
  // set local variable user to session user
  res.locals.user = req.session.user;
  next();
});

app.get('/', (req, res) => {
  Article.find({}, function(err, articles, count) {
    // send context object with every article found in db to homepage
    res.render('index', {articles: articles.reverse()});
  });
});

app.get('/article/add', (req, res) => {
  // check if user is logged in, or else redirect them to do so
  if (!req.session.user) {
    res.redirect('/login');
  }
  else {
    res.render('article-add');
  }
});

app.post('/article/add', (req, res) => {
  // create new article with fields that match the form fields
  new Article({
    title: req.body.title,
    url: req.body.url,
    description: req.body.description,
    userId: res.locals.user._id
  }).save(function(err, newArticle, count) {
    if (err) {
      // log error and create error context object if error
      console.log(err);
      const errObj = {message: 'COULD NOT ADD ARTICLE'};
      console.log(errObj.message);
      res.render('article-add', {message: errObj.message});
    }
    else {
      // if no error, redirect to homepage
      res.redirect('/');
    }
  });
});

app.get('/article/:slug', (req, res) => {
  // find article that matches the slug in the url
  Article.findOne({slug: req.params.slug}, function(err, article, count) {
    // once article is found, look for user that has object id that matches related article id
    User.findOne({_id: article.userId}, function(err, user, count) {
      // render the page with appropriate context object
      res.render('article-detail', {a: article, u: user});
    });
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  // call register function with form's register's fields as paramters
  auth.register(req.body.username, req.body.email, req.body.password,
  // error callback
  (errObj) => {
    res.render('register', {message: errObj.message});
  },
  // success call back
  (user) => {
    auth.startAuthenticatedSession(req, user, () => {
      // set session user to user who just registered and redirect to home
      req.session.user = user;
      res.redirect('/');
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  // log in user using login form's fields
  auth.login(req.body.username, req.body.password,
  // error call back
  (errObj) => {
    // redisplay login page but with error message
    res.render('login', {message: errObj.message});
  },
  // success call back
  (user) => {
    auth.startAuthenticatedSession(req, user, () => {
      // set session user to user who just registered and redirect to home
      req.session.user = user;
      res.redirect('/');
    });
  });
});


app.get('/:username', (req, res) => {
  // look for user that has username that matches the username parameter
  User.findOne({username: req.params.username}, function(err, user, count) {
    // check if user exists
    if (user) {
      // now check if there are any articles that have an id that matches the user's id
      Article.find({userId: user._id}, function(err, articles, count) {
        // render page
        res.render('user-single', {articles: articles, username: req.params.username});
      });
    }
    else {
      // 'username' is just the name of the variable used to find a user,
      // so it could be any path that does not exist, not just a user
      res.status(404).send('<pre>Cannot GET ' + req.path + '</pre>');
    }
  });
});

app.listen(3000);
