import dns from 'node:dns';
import pg from 'pg';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

try { dns.setDefaultResultOrder('ipv4first'); } catch {}

pg.defaults.ssl = { rejectUnauthorized: false };

const common = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
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
  },
  define: {
    underscored: true 
  }
};

let sequelize;

if (process.env.DATABASE_URL) {
  console.log('[DB] Using DATABASE_URL');
  sequelize = new Sequelize(process.env.DATABASE_URL, common);
} else {
  const host = process.env.SUPABASE_DB_HOST || process.env.DB_HOST;
  const port = Number(process.env.SUPABASE_DB_PORT || process.env.DB_PORT || 5432);
  const database = process.env.SUPABASE_DB_NAME || process.env.DB_NAME;
  const username = process.env.SUPABASE_DB_USER || process.env.DB_USER;
  const password = process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD;

  if (!host || !database || !username || !password) {
    throw new Error('Config do banco não encontrada. Defina DATABASE_URL ou SUPABASE_DB_* ou DB_*');
  }

  console.log(`[DB] Using separate vars: host=${host} port=${port} db=${database} user=${username}`);
  sequelize = new Sequelize({ ...common, host, port, database, username, password });
}

export { sequelize };