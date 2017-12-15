const express = require('express');
require('dotenv').config();
require('../database/bookshelf');
// const Post = require('../database/models/posts');
const { createPosts, createFeeds } = require('../database/helpers/data_generator');


const app = express();


app.get('/', (req, res) => {

// createPosts();


  res.send(createFeeds());
});


app.listen(8080, () => console.log('Lstening on port 8080'));
