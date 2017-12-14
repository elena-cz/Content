exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('posts', (table) => {
      table.increments('id').primary();
      table.integer('user_id');
      table.string('username');
      table.string('profile_img_url');
      table.string('img_url');
      table.text('caption');
      table.text('location');
      table.integer('like_count');
      table.timestamps();
    }),
    knex.schema.createTable('feeds', (table) => {
      table.increments('id').primary();
      table.integer('user_id');
      table.jsonb('post_feed');
      table.timestamps();
    }),
    knex.schema.createTable('friend_likes', (table) => {
      table.increments('id').primary();
      table.integer('user_id');
      table.integer('post_id').references('posts.id');
      table.jsonb('friend_likes');
      table.timestamps();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema
      .dropTable('posts')
      .dropTable('feeds')
      .dropTable('friend_likes'),
  ]);
};

