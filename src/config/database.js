import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

function makeSequelizeFromSeparate(prefix = '') {
  const get = (k, def) => process.env[`${prefix}${k}`] ?? def;
  const host = get('DB_HOST');
  const port = Number(get('DB_PORT') || 5432);
  const database = get('DB_NAME');
  const username = get('DB_USER');
  const password = get('DB_PASSWORD');

  if (!host || !database || !username || !password) return null;

  return new Sequelize({
    dialect: 'postgres',
    host,
    port,
    database,
    username,
    password,
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      keepAlive: true
    },
    pool: {
      max: 5,     
      min: 0,
      acquire: 60000, 
      idle: 10000     
    },
    retry: {
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        'ETIMEDOUT',
        'ECONNRESET',
        'ECONNREFUSED'
      ],
      max: 3
    }
  });
}

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      keepAlive: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    retry: {
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        'ETIMEDOUT',
        'ECONNRESET',
        'ECONNREFUSED'
      ],
      max: 3
    }
  });
} else {
  sequelize = makeSequelizeFromSeparate('SUPABASE_');
  if (!sequelize) {
    sequelize = makeSequelizeFromSeparate('');
  }
}

if (!sequelize) {
  throw new Error('Config do banco não encontrada. Defina DATABASE_URL ou SUPABASE_DB_* ou DB_*');
}

export { sequelize };