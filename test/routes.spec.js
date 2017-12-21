/* eslint-disable */

process.env.NODE_ENV = 'test';
const { knex } = require('../database/bookshelf');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('API Routes', function () {

  beforeEach(function(done) {
    knex.seed.run()
      .then(function() {
        done();
      })
  });

  describe('Server is running', function () {
    it ('should return a response', function (done) {
      chai.request(server)
        .get('/')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Get user feed', function () {
    it ('should return 10 most recent posts, if starting index is 0', function (done) {
      chai.request(server)
        .get('/users/1/post_feed/0')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('user_id').eql(1);
          expect(res.body).to.have.property('next_post_index').eql(20);
          expect(res.body).to.have.property('feed');
          expect(res.body.feed.length).to.eql(10);
          done();
        });
    });
  });
});
