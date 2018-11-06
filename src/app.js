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

app.get('/', (req, res) => {
});

app.get('/article/add', (req, res) => {
});

app.post('/article/add', (req, res) => {
});

// come up with a url for /article/slug-name!
// app.get('add url here!', (req, res) => {
// });

app.get('/register', (req, res) => {
});

app.post('/register', (req, res) => {
});
        

app.get('/login', (req, res) => {
});

app.post('/login', (req, res) => {
});

app.listen(3000);
