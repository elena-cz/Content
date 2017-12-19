require('dotenv').config();
require('newrelic');
// const apm = require('elastic-apm-node').start({
//   appName: 'ig-posts',
//   serverUrl: 'http://localhost:8200',
// });
const express = require('express');
require('../database/bookshelf');
const { getUserFeed, getFeedSlice, getPostInfo, getFriendLikes, getFriendLikesById } = require('../database/helpers/getUserFeed');
const { saveLike, incrementLikeCount, addFriendLike, getFollowers } = require('../database/helpers/saveLikes');
// const { generatePosts, generateFeeds } = require('../database/helpers/data_generator');

const app = express();


// *** API Endpoints *** //

app.get('/', (req, res) => {
  res.send('Post Service');
});

// Load posts for user ID, starting at index in feed array
app.get('/users/:user_id/post_feed/:next_post_index', (req, res) => {
  getUserFeed(req.params.user_id, req.params.next_post_index)
    .then(results => res.send(results));
});

// Save new like on post
app.post('/likes/posts/:post_id/users/:user_id', (req, res) => {
  // postId = 9999977
  // liker userId=10641997, username=Rosemarie2
  saveLike(req.params.post_id, req.params.user_id)
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('error:', error);
      res.sendStatus(500);
    });
});


// *** Testing routes *** //

// LOAD USER FEED

// Get slice of feed
app.get('/testing/feed_slice', (req, res) => {
  getFeedSlice('7890', '124')
    .then(results => res.send(results));
});

// Get post info for array of 10 post IDs
app.get('/testing/post_info', (req, res) => {
  getPostInfo([9921405, 9915528, 9903279, 9902614, 9889263, 9881134, 9876888, 9867126, 9865648, 9852171])
    .then(results => res.send(results));
});

// Get friend_likes for array of 10 post IDs
app.get('/testing/friend_likes', (req, res) => {
  getFriendLikes('7890', [9921405, 9915528, 9903279, 9902614, 9889263, 9881134, 9876888, 9867126, 9865648, 9852171])
    .then(results => res.send(results));
});

// Get friend_likes for array of 10 items
app.get('/testing/friend_likes_byId', (req, res) => {
  getFriendLikesById([1183638, 1183639, 1183640, 1183641, 1183642, 1183643, 1183644, 1183645, 1183646, 1183647])
    .then(results => res.send(results))
    .catch((error) => {
      console.log('error:', error);
      res.sendStatus(500);
    });
});

// Get a user's most recent 10 posts
app.get('/testing/user_feed', (req, res) => {
  getUserFeed('7890', '0')
    .then(results => res.send(results))
    .catch(() => res.sendStatus(500));
});

// SAVE POST LIKE

// Increment like count for post
app.get('/testing/increment_like_count/', (req, res) => {
  incrementLikeCount('10641918')
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('error:', error);
      res.sendStatus(500);
    });
});

// Get followers
app.get('/testing/get_followers', (req, res) => {
  getFollowers()
    .then((results) => res.send(results))
    .catch((error) => {
      console.log('error:', error);
      res.sendStatus(500);
    });
});

// Fake like info
const likeInfo = {
  userId: '10641997',
  username: 'Rosemarie2',
  followers: [44750, 42321, 30805, 28050, 24282, 20441, 9953, 9390, 6356, 5702],
};

// Update friend_likes array for each follower
app.get('/testing/add_friend_like/', (req, res) => {
  addFriendLike('9999977', likeInfo)
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('error:', error);
      res.sendStatus(500);
    });
});


// Save new like on post
app.get('/testing/save_post_like', (req, res) => {
  // postId = 9999977
  // liker userId=10641997, username=Rosemarie2
  saveLike('9999977', '10641997')
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('error:', error);
      res.sendStatus(500);
    });
});


// For console logging times (can delete if not needed)
// const startTime = Date.now();
// .then(() => console.log(`Feed slice in ${(Date.now() - startTime) / 1000} seconds`));

// *** Data generation routes *** //

// Generate posts
// app.get('/posts', (req, res) => {
//   generatePosts();
//   res.send('generating feeds');
// });

// Generate new feeds for userID starting at ':start'
// app.get('/feeds/:start', (req, res) => {
//   generateFeeds(req.params.start);
//   res.send(req.params.start);
// });


app.listen(8080, () => console.log('Listening on port 8080'));
