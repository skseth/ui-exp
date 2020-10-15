const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const knexConfig = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    extension: 'ts',
    tableName: 'knex_migrations',
    directory: 'migrations'
  },
  timezone: 'UTC'
};

export default knexConfig;
