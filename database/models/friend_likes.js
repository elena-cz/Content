const bookshelf = require('../bookshelf');

const FriendLike = bookshelf.Model.extend({
  tableName: 'friend_likes',
  hasTimestamps: true,
});

module.exports = FriendLike;
