const bookshelf = require('../bookshelf');

const Feed = bookshelf.Model.extend({
  tableName: 'feeds',
  hasTimestamps: true,
});

module.exports = Feed;
