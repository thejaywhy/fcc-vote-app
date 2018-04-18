'use strict';
var bodyParser = require('body-parser');

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

var jsonParser = bodyParser.json();

module.exports = function (app, passport) {

  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

  var pollHandler = new PollHandler();

  app.route('/')
//    .get(isLoggedIn, function (req, res) {
    .get(function (req, res) {
      res.sendFile(path + '/public/index.html');
    });

  app.route('/login')
    .get(function (req, res) {
      res.sendFile(path + '/public/login.html');
    });

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/profile')
    .get(isLoggedIn, function (req, res) {
      res.sendFile(path + '/public/profile.html');
    });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/api/polls')
//    .get(isLoggedIn, pollHandler.getPolls)
//    .post(isLoggedIn, jsonParser, pollHandler.addPoll)
    .get(pollHandler.getPolls)
    .post(jsonParser, pollHandler.addPoll);

  app.route('/api/poll/:id')
//    .get(isLoggedIn, pollHandler.getPoll)
//    .put(isLoggedIn, pollHandler.updatePoll)
//    .delete(isLoggedIn, pollHandler.deletePoll);
    .get(pollHandler.getPoll)

  app.route('/api/user/:id')
    .get(isLoggedIn, function (req, res) {
      res.json(req.user.github);
    });

};
