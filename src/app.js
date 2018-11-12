const express = require('express');
const mongoose = require('mongoose');

require('./db');
const session = require('express-session');
const path = require('path');
const auth = require('./auth.js');

const app = express();

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
})

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/article/add', (req, res) => {
});

app.post('/article/add', (req, res) => {
});

// come up with a url for /article/slug-name!
// app.get('add url here!', (req, res) => {
// });

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
    res.render('login', {message: errObj.message})
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

app.listen(3000);
