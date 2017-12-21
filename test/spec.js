/* eslint-disable */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { knex } = require('../database/index');

const expect = chai.expect;

chai.use(chaiHttp);


before(function(done) {
  Promise.resolve(knex.migrate.latest({ directory: 'database/migrations' })
    .then(function() {
      return knex.seed.run();
    })
    .then(function() {
      done();
    }));
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
  it ('should return a response with user_id and next_post_index', function (done) {
    chai.request(server)
      .get('/users/1/post_feed/0')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user_id').eql(1);
        expect(res.body).to.have.property('next_post_index').eql(20);
        done();
      });
  });


  it ('should return 10 most recent posts, if starting index is 0', function (done) {
    chai.request(server)
      .get('/users/1/post_feed/0')
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.have.property('feed');
        expect(res.body.feed.length).to.equal(10);
        expect(res.body.feed[0].id).to.equal(40);
        expect(res.body.feed[9].id).to.equal(28);
        done();
      });
  });

  it ('should return friend_likes for each post', function (done) {
    chai.request(server)
      .get('/users/1/post_feed/0')
      .end(function(err, res) {
        expect(res.body.feed[0].friend_likes.length).to.equal(1);
        expect(res.body.feed[0].friend_likes[0].user_id).to.equal(3);
        done();
      });
  });

  it ('should return next set of 10 posts when given next_post_index !== 0', function (done) {
    chai.request(server)
      .get('/users/1/post_feed/20')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user_id').eql(1);
        expect(res.body).to.have.property('next_post_index').eql(10);
        expect(res.body).to.have.property('feed');
        expect(res.body.feed.length).to.equal(10);
        expect(res.body.feed[0].id).to.equal(27);
        expect(res.body.feed[9].id).to.equal(15);
        done();
      });
  });

  it ('should return empty array if next_post_index is out of bounds', function (done) {
    chai.request(server)
      .get('/users/1/post_feed/100')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user_id').eql(1);
        expect(res.body).to.have.property('next_post_index').eql(90);
        expect(res.body).to.have.property('feed');
        expect(res.body.feed.length).to.equal(0);
        done();
      });
  });
});


 describe('Save post like', function () {

  beforeEach(function(done) {
     Promise.resolve(knex.seed.run())
      .then(function() {
        done();
      })
  });

  it ('should increment like count for post', function (done) {
    chai.request(server)
      .post('/likes/posts/4/users/5')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        knex('posts').where('id', 4).select('like_count')
          .then((results) => {
            expect(results[0].like_count).to.equal(11);
            done();
          });
      });
  });

  it ('should add user to friend_likes for group of followers', function (done) {
    chai.request(server)
      .post('/likes/posts/4/users/5')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        knex('friend_likes').where('id', 8).select('friend_likes')
          .then((results) => {
            const friendLikes = results[0].friend_likes;
            expect(friendLikes.length).to.equal(2);
            expect(friendLikes[0].user_id).to.equal(5);
            done();
          });
      });
  });

  it ('should not add user to friend_likes for non-followers', function (done) {
    chai.request(server)
      .post('/likes/posts/4/users/5')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        knex('friend_likes').where('id', 9).select('friend_likes')
          .then((results) => {
            const friendLikes = results[0].friend_likes;
            expect(friendLikes.length).to.equal(2);
            expect(friendLikes[0].user_id).to.equal(1);
            done();
          });
      });
  });

  it ('should not add user to any friend_likes arrays if no mutual followers', function (done) {
    chai.request(server)
      .post('/likes/posts/4/users/6')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        knex('friend_likes').where('id', 8).select('friend_likes')
          .then((results) => {
            const friendLikes = results[0].friend_likes;
            expect(friendLikes.length).to.equal(1);
            expect(friendLikes[0].user_id).to.equal(1);
            done();
          });
      });
  });

});
