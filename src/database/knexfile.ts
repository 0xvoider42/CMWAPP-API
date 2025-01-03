import { knexSnakeCaseMappers } from 'objection';

const config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'campaign_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    directory: 'migrations',
  },
  seeds: {
    directory: './seeds',
  },
  ...knexSnakeCaseMappers(),
};

module.exports = config;
