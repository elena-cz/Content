const express = require('express');
require('dotenv').config();
require('../database/bookshelf');
// const Post = require('../database/models/posts');
const { createPosts, createFeeds } = require('../database/helpers/data_generator');


const app = express();


app.get('/', (req, res) => {

// createPosts();

  // createFeeds();


  res.send('generating feeds');
});

// Create new feeds for userID starting at ':start'
// app.get('/feeds/:start', (req, res) => {
//   createFeeds(req.params.start);
//   res.send(req.params.start);
// });


app.listen(8080, () => console.log('Lstening on port 8080'));
