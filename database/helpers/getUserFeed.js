const Promise = require('bluebird');
const { knex } = require('../index');


const getFeedSlice = (userId, startIndex) => (
  new Promise((resolve) => {
    knex('feeds').where('user_id', userId * 1).select('post_feed')
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
        const feed = {};
        results.forEach((post) => {
          feed[post.id * 1] = post;
        });
        resolve(feed);
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
          friendLikes[feedItem.post_id * 1] = feedItem.friend_likes;
        });
        resolve(friendLikes);
      });
  })
);


const getUserFeed = (userId, startIndex) => (
  new Promise((resolve) => {
    getFeedSlice(userId, startIndex)
      .then(({ nextPostIndex, postIds }) => (
        Promise.all([nextPostIndex, postIds, getPostInfo(postIds), getFriendLikes(userId, postIds)])
      ))
      .then(([nextPostIndex, postIds, postResp, likesResp]) => {
        const response = {
          user_id: userId * 1,
          next_post_index: nextPostIndex,
          feed: [],
        };
        response.feed = postIds.map((id) => {
          const post = postResp[id];
          post.friend_likes = likesResp[id];
          return post;
        });
        resolve(response);
      });
  })
);


module.exports.getUserFeed = getUserFeed;
module.exports.getFeedSlice = getFeedSlice;
module.exports.getPostInfo = getPostInfo;
module.exports.getFriendLikes = getFriendLikes;
module.exports.getFriendLikesById = getFriendLikesById;
