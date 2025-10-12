import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

function safeLogDbUrl(url) {
  if (!url) return 'undefined';
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}:${u.port || ''}${u.pathname}${u.search}`;
  } catch {
    return '(invalid URL format)';
  }
}

const common = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
    keepAlive: true
  },
  pool: { max: 5, min: 0, acquire: 60000, idle: 10000 },
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
};

function makeFromSeparate(prefix = '') {
  const get = (k, def) => process.env[`${prefix}${k}`] ?? def;
  const host = get('DB_HOST');
  const port = Number(get('DB_PORT', 5432));
  const database = get('DB_NAME');
  const username = get('DB_USER');
  const password = get('DB_PASSWORD');

  if (!host || !database || !username || !password) return null;

  console.log(`[DB] Using separate vars ${prefix ? '(' + prefix + ')' : ''}: host=${host} port=${port} db=${database} user=${username}`);

  return new Sequelize({
    ...common,
    host,
    port,
    database,
    username,
    password
  });
}

let sequelize;

if (process.env.DATABASE_URL) {
  console.log('[DB] Using DATABASE_URL:', safeLogDbUrl(process.env.DATABASE_URL));
  sequelize = new Sequelize(process.env.DATABASE_URL, common);
} else {
  sequelize = makeFromSeparate('SUPABASE_') || makeFromSeparate('');
}

if (!sequelize) {
  throw new Error('Config do banco não encontrada. Defina DATABASE_URL ou SUPABASE_DB_* ou DB_*');
}

export { sequelize };