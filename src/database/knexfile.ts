import { knexSnakeCaseMappers } from 'objection';
import configuration from '../config/configuration';

const config = configuration();

export default {
  client: config.database.client,
  connection: config.database.connection,
  pool: config.database.pool,
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
  },
  ...knexSnakeCaseMappers(),
};
