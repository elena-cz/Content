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
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('feeds', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unique();
      table.jsonb('post_feed');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('friend_likes', (table) => {
      table.increments('id').primary();
      table.integer('user_id');
      table.integer('post_id').references('posts.id');
      table.jsonb('friend_likes');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
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

