//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var server = require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe.skip('App', () => {

  beforeEach((done) => { 
    done();
  });

  describe(' an authenticated user,', () => {
    it('it should keep my polls between sessions', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    }),

    it('it should let me share polls with friends', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    }),

    it('it should show me aggregate results of my polls', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    }),

    it('it should allow me to delete polls', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    }),

    it('it should let me create a pol with any number of possible items', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    }),

    it('it should show all polls', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    }),

    it('it should allow voting on any poll', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    }),

    it('it should show poll results in chart form', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    })

  });

  describe('As an unauthenticated user,', () => {
    it('it should allow voting on any poll', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    }),

    it('it should show poll results in chart form', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    }),

    it('it should allow me to create new options on a poll', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.html;

          done();
        });
    })

  });

});
