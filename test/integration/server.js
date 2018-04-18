'use strict';
/* jshint esversion: 6, expr: true */

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var path = process.cwd();

var server = require(path + '/server');
var Poll = require(path + '/app/models/polls.model').Poll;
var Choice = require(path + '/app/models/polls.model').Choice;

var sinon = require('sinon');
var mongoose = require('mongoose');

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinonChai = require("sinon-chai");

// set up chai & modules
chai.use(chaiHttp);
chai.use(sinonChai);
var should = chai.should();

chai.use(chaiHttp);

const sandbox = sinon.sandbox.create();

describe('INTEGRATION: Polls API', () => {
  beforeEach((done) => { 
    done();
  });

  describe('When I GET /api/polls', () => {
    it('should return all polls to an unauthenticated user', (done) => {
      chai.request(server)
        .get('/api/polls')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          done();
        });
    });
  });

  describe('When I GET /api/poll/{pollId}', () => {
    const expectedPoll = {
      displayName: 'Best Oranges',
      choices: [
        {displayName: "Blood"},
        {displayName: "Florida"}
      ]
    };

    beforeEach(function(done){

      Choice.remove({}, function(err) {
        if (err) console.log("error removing all Choices");
      });
      Poll.remove({}, function(err) {
        if (err) console.log("error removing all Polls");
      });

      var myPoll = new Poll(expectedPoll);
      myPoll.save(function (err) {
        if (err) console.log("error created single poll");
        done();
      });
    });

    // when('the poll exists')
    it('should return the poll to an authenticated user', (done) => {
      chai.request(server)
        .get('/api/poll/' + expectedPoll.displayName)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          done();
        });
    });

    // when('the poll does not exists')
    it('should return a 404 error', (done) => {
      chai.request(server)
        .get('/api/poll/NOTREAL')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('error');

          done();
        });
    });

    afterEach(function(done){
      Choice.remove({}, function(err) {
        if (err) console.log("error removing all Choices");
      });
      Poll.remove({}, function(err) {
        if (err) console.log("error removing all Polls");
      });
      done();
    });


  });

  describe('When I POST /api/polls', () => {
    before(function(done){
      Choice.remove({}, function(err) {
        if (err) console.log("error removing all Choices");
      });
      Poll.remove({}, function(err) {
        if (err) console.log("error removing all Polls");
      });
      done();
    });

    it('should add a poll to the database and return the poll', (done) => {
      const myPoll = {
        displayName: 'Best Apples',
        choices: [
          {displayName: "Empire"},
          {displayName: "Gala"}
        ]
      };

      chai.request(server)
        .post('/api/polls')
        .send(myPoll)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('created_on');
          res.body.should.have.property('displayName');
          res.body.should.have.property('choices');

          done();
        });

    });

    afterEach(function(done){
      Choice.remove({}, function(err) {
        if (err) console.log("error removing all Choices");
      });
      Poll.remove({}, function(err) {
        if (err) console.log("error removing all Polls");
      });
      done();
    });

  });

  //Drop db connect after all tests
  after(function(done){
    Choice.remove({}, function(err) {
      if (err) console.log("error removing all Choices");
    });
    Poll.remove({}, function(err) {
      if (err) console.log("error removing all Polls");
    });
    sandbox.restore();
    done();
  });

});
