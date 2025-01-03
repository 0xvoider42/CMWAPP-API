/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const configuration = require('./dist/config/configuration').default();

module.exports = {
  client: configuration.database.client,
  connection: configuration.database.connection,
  pool: configuration.database.pool,
  migrations: {
    directory: path.join(__dirname, 'src/database/migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.join(__dirname, 'src/database/seeds'),
  },
};
