const Promise = require('bluebird');
const { knex } = require('../bookshelf');


const getFeedSlice = (userId, startIndex) => (
  new Promise((resolve) => {
    knex('feeds').where('user_id', userId).select('post_feed')
      .then((results) => {
        const feed = results[0].post_feed;
        const index = (startIndex !== '0') ? startIndex * 1 : feed.length;
        const postIds = feed.slice(index - 10, index).reverse();
        resolve({ nextPostIndex: index - 10, postIds });
      });
  })
);

const getPostInfo = postIds => (
  new Promise((resolve) => {
    knex('posts').whereIn('id', postIds)
      .then((results) => {
        resolve(results);
      });
  })
);

const getFriendLikes = (userId, postIds) => (
  new Promise((resolve, reject) => {
    knex('friend_likes').whereIn('post_id', postIds).andWhere('user_id', userId)
      .then((results) => {
        const friendLikes = {};
        results.forEach((feedItem) => {
          friendLikes[feedItem.post_id] = feedItem.friend_likes;
        });
        resolve(friendLikes);
      })
      .catch(error => reject(error));
  })
);


// For testing - can delete
const getFriendLikesById = feedLikesIds => (
  new Promise((resolve) => {
    knex('friend_likes').whereIn('id', feedLikesIds)
      .then((results) => {
        const friendLikes = {};
        results.forEach((feedItem) => {
          friendLikes[feedItem.post_id] = feedItem.friend_likes;
        });
        resolve(friendLikes);
      });
  })
);


const getUserFeed = (userId, startIndex) => (
  new Promise((resolve) => {
    getFeedSlice(userId, startIndex)
      .then(({ nextPostIndex, postIds }) => (
        Promise.all([nextPostIndex, getPostInfo(postIds), getFriendLikes(userId, postIds)])
      ))
      .then(([nextPostIndex, postResp, likesResp]) => {
        const response = {
          user_id: userId * 1,
          next_post_index: nextPostIndex,
          feed: postResp,
        };
        response.feed.forEach(post => post.friend_likes = likesResp[post.id]);
        resolve(response);
      });
  })
);


module.exports.getUserFeed = getUserFeed;
module.exports.getFeedSlice = getFeedSlice;
module.exports.getPostInfo = getPostInfo;
module.exports.getFriendLikes = getFriendLikes;
module.exports.getFriendLikesById = getFriendLikesById;
