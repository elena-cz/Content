const bookshelf = require('../bookshelf');

const Post = bookshelf.Model.extend({
  tableName: 'posts',
  hasTimestamps: true,
});

module.exports = Post;
