const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV]);

knex.migrate.latest({ directory: 'database/migrations' });
console.log('DB_HOST', process.env.DB_HOST);

module.exports.knex = knex;
