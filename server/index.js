const express = require('express');
require('dotenv').config();
require('../database/bookshelf');
const { getUserFeed, getFeedSlice, getPostInfo, getFriendLikes } = require('../database/helpers/getUserFeed');
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


// *** Testing routes *** //

// Get slice of feed
app.get('/testing/feed_slice', (req, res) => {
  const startTime = Date.now();
  getFeedSlice('7890', '124')
    .then(results => res.send(results))
    .then(() => console.log(`Feed slice in ${(Date.now() - startTime) / 1000} seconds`));
});

// Get post info for array of 10 post IDs
app.get('/testing/post_info', (req, res) => {
  const startTime = Date.now();
  getPostInfo([9921405, 9915528, 9903279, 9902614, 9889263, 9881134, 9876888, 9867126, 9865648, 9852171])
    .then(results => res.send(results))
    .then(() => console.log(`Post info in ${(Date.now() - startTime) / 1000} seconds`));
});

// Get friend_likes for array of 10 post IDs
app.get('/testing/friend_likes', (req, res) => {
  const startTime = Date.now();
  getFriendLikes('7890', [9921405, 9915528, 9903279, 9902614, 9889263, 9881134, 9876888, 9867126, 9865648, 9852171])
    .then(results => res.send(results))
    .then(() => console.log(`Friend likes in ${(Date.now() - startTime) / 1000} seconds`));
});

// Get a user's most recent 10 posts
app.get('/testing/user_feed', (req, res) => {
  const startTime = Date.now();
  getUserFeed('7890', '0')
    .then(results => res.send(results))
    .then(() => console.log(`User feed in ${(Date.now() - startTime) / 1000} seconds`));
});


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
