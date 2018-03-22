'use strict';

var sinon = require('sinon');
var mongoose = require('mongoose');

var chai = require('chai');
var should = chai.should();

var Poll = require(process.cwd() + '/app/models/polls.model').Poll;
var Choice = require(process.cwd() + '/app/models/polls.model').Choice;

describe('Polls', () => {
  it('should be invalid if displayName is empty', (done) => {
    var p = new Poll();

    p.validate(function(err) {
      err.should.exist;
      done();
    });
  }),

  it('should be have default values', (done) => {
    var p = new Poll();
    p.should.have.property('created_on');
    p.created_on.should.not.be.null;
    p.should.have.property('choices');
    p.choices.should.be.empty;
    done();
  })

});

describe('Choices', () => {
  it('should be invalid if displayName is empty', (done) => {
    var c = new Choice();
    c.validate(function(err) {
      err.should.exist;
      done();
    });
  })

  it('should have default value of 0', (done) => {
    var c = new Choice();
    c.should.have.property('votes');
    c.votes.should.equal(0)
    done();
  })

});
