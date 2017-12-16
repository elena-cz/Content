
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('friend_likes', (t) => {
      t.index(['user_id', 'post_id']);
    }),
    knex.schema.table('feeds', (t) => {
      t.index(['user_id']);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('friend_likes', (t) => {
      t.dropIndex(['user_id', 'post_id']);
    }),
    knex.schema.table('feeds', (t) => {
      t.dropIndex(['user_id']);
    }),
  ]);
};
