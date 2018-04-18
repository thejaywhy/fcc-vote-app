'use strict';
/* jshint esversion: 6, expr: true */

var sinon = require('sinon');
var mockReq = require('sinon-express-mock').mockReq;
var mockRes = require('sinon-express-mock').mockRes;
var sinonChai = require("sinon-chai");

var mongoose = require('mongoose');

var chai = require('chai');
chai.use(sinonChai);
var should = chai.should();

var path = process.cwd();

var Poll = require(path + '/app/models/polls.model').Poll;
var Choice = require(path + '/app/models/polls.model').Choice;

var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

const sandbox = sinon.sandbox.create();

describe('Polls API', () => {

  describe('When I GET /api/polls', () => {
    it('should return all polls to an unauthenticated user', (done) => {
      const expectedResults = [
        "test poll 1",
        "test poll 2"
      ];

      var PollMock = sinon.mock(Poll);
      PollMock
        .expects('find')
        .yields(null, expectedResults);

      const req = mockReq();
      const res = mockRes();

      var handler = new PollHandler();
      handler.getPolls(req, res);

      res.json.should.have.been.calledWith({polls: expectedResults});

      PollMock.verify();
      PollMock.restore();

      done();
    });
  });

  describe('When I POST /api/polls', () => {

    it('should error if no body sent', (done) => {
      const req = mockReq({body: null});
      const res = mockRes();

      var handler = new PollHandler();
      handler.addPoll(req, res);

      res.status.should.have.been.calledWith(400);
      res.json.should.have.been.calledWith({error: "missing body"});

      done();
    });

    it('should error if no displayName field sent', (done) => {
      const req = mockReq({
        body: {
          foo: 'bar'
        }
      });
      const res = mockRes();

      var handler = new PollHandler();
      handler.addPoll(req, res);

      res.status.should.have.been.calledWith(400);
      res.json.should.have.been.calledWith({error: "Must give a 'displayName'"});

      done();
    });

    it('should error if empty displayName sent', (done) => {
      const req = mockReq({
        body: {
          displayName: ''
        }
      });
      const res = mockRes();

      var handler = new PollHandler();
      handler.addPoll(req, res);

      res.status.should.have.been.calledWith(400);
      res.json.should.have.been.calledWith({error: "Must give a 'displayName'"});

      done();
    });

    it('should error if no choices field sent', (done) => {
      const req = mockReq({
        body: {
          displayName: 'Best Apples'
        }
      });
      const res = mockRes();

      var handler = new PollHandler();
      handler.addPoll(req, res);

      res.status.should.have.been.calledWith(400);
      res.json.should.have.been.calledWith({error: "Must specify a 'choices' array"});

      done();
    });

    it('should error if empty choices array sent', (done) => {
      const req = mockReq({
        body: {
          displayName: 'Best Apples',
          choices: []
        }
      });
      const res = mockRes();

      var handler = new PollHandler();
      handler.addPoll(req, res);

      res.status.should.have.been.calledWith(400);
      res.json.should.have.been.calledWith({error: "Must specify a 'choices' array"});

      done();
    });

    it('should add a poll to the database and return the poll', (done) => {
      const myPoll = {
        body: {
          displayName: 'Best Apples',
          choices: [
            {displayName: "Empire"},
            {displayName: "Gala"}
          ]
        }
      };

      var PollStubSave = sinon.stub(Poll.prototype, 'save');
      PollStubSave.yields(null, myPoll.body);

      var PollMock = sinon.mock(Poll);
      PollMock
        .expects('findOne')
        .yields(null, null);

      const req = mockReq(myPoll);
      const res = mockRes();

      var handler = new PollHandler();
      handler.addPoll(req, res);

      res.status.should.have.been.calledWith(201);
      res.json.should.have.been.calledWith(PollStubSave.thisValues[0]);

      PollStubSave.should.have.been.calledOnce;
      PollStubSave.restore();

      PollMock.verify();
      PollMock.restore();

      done();
    });

  });

  describe('When I GET /api/poll/{pollid}', () => {
    it('should return all a single poll to an unauthenticated user', (done) => {
      const expectedPoll = {
        displayName: 'Best Oranges',
        choices: [
          {displayName: "Blood"},
          {displayName: "Florida"}
        ]
      };

      var PollMock = sinon.mock(Poll);
      PollMock
        .expects('find')
        .yields(null, [expectedPoll]);

      const req = mockReq({params: {id: 'foo'}});
      const res = mockRes();

      var handler = new PollHandler();
      handler.getPoll(req, res);

      res.json.should.have.been.calledWith(expectedPoll);

      PollMock.verify();
      PollMock.restore();

      done();
    });

    it('should return an error if poll does not exist', (done) => {
      var PollMock = sinon.mock(Poll);
      PollMock
        .expects('find')
        .yields(null, []);

      const req = mockReq({params: {id: 'foo'}});
      const res = mockRes();

      var handler = new PollHandler();
      handler.getPoll(req, res);

      res.status.should.have.been.calledWith(404);
      res.json.should.have.been.calledWith({ error: "Can't find poll with name: foo" });

      PollMock.verify();
      PollMock.restore();

      done();
    });
  });

 
  //Drop db connect after all tests
  after(function(done){
    sandbox.restore();
    done();
  });

});
