const Promise = require('bluebird');
const { knex } = require('../index');
const axios = require('axios');

/**
 * To save a new like on a post:
 *
 * Incremement like count for postId
 * Get list of users who follow both users
 * For each follower find the row in friend_likes where userId is follower
 * and add liker userId and username into front of friend likes array
 **/


const incrementLikeCount = postId => (
  new Promise((resolve, reject) => {
    knex('posts')
      .where('id', postId)
      .increment('like_count', 1)
      .returning('user_id')
      .then(userId => resolve(userId))
      .catch(error => reject(error));
  })
);


const getFollowers = (postUserId, likeUserId) => {
  // Uncomment when getting ready to integrate
  // Add IP of People service after integration
  // Add code to extract username of liker and list of followers from results
  //   axios.get(`/users/${postUserId}/${likeUserId}/followers`)
  //     .then((results) => console.log(results));

  // For testing without integration to People service
  if (process.env.NODE_ENV === 'test') {
    if (likeUserId === 5) {
      return Promise.resolve({
        user_id: likeUserId,
        username: 'BB-8',
        followers: [1, 2],
      });
    }

    return Promise.resolve({
      user_id: likeUserId,
      username: 'Hux',
      followers: [],
    });
  }

  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({
      user_id: '10641920',
      username: 'Elena',
      followers: [44750, 42321, 30805, 28050, 24282, 20441, 9953, 9390, 6356, 5702],
    });
  }

  return Promise.reject();
};

const addFriendLike = (postId, { user_id, username, followers }) => (
  Promise.map(followers, followerId => (
    knex('friend_likes')
      .where({
        post_id: postId,
        user_id: followerId,
      })
      .select('friend_likes')
      .then((results) => {
        const likes = results[0].friend_likes;
        likes.unshift({ user_id, username });
        return knex('friend_likes')
          .where({
            post_id: postId,
            user_id: followerId,
          })
          .update('friend_likes', JSON.stringify(likes));
      })
  ))
);


const saveLike = (postId, userId) => (
  incrementLikeCount(postId)
    .then(postUserId => getFollowers(postUserId, userId))
    .then(likeInfo => addFriendLike(postId, likeInfo))
);

module.exports.saveLike = saveLike;
module.exports.incrementLikeCount = incrementLikeCount;
module.exports.addFriendLike = addFriendLike;
module.exports.getFollowers = getFollowers;
