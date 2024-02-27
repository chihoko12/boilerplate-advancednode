'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const res = require('express/lib/response.js');
const session = require('express-session');
const passport = require('passport');
const { ObjectID } = require('mongodb');
const e = require('express');

const app = express();

app.set('view engine', 'pug'); 
app.set('views', './views/pug');

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

passport.initialize();
passport.session();

myDB(async client=> {
  const myDataBase = await client.db('database').collection('users')

  app.route('/').get((req, res) => {
    res.render('index', { title:'Connected to Database', message: 'Please log in' }); 
  });

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
    // myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null,doc);
    });
  // });

}).catch(e => {
  app.route('/').get((req,res) => {
    res.render('index', { title: e, message: 'Unable to connect to databse'})
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
