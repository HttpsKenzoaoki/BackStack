import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log("🔍 Verificando variáveis de ambiente:");
console.log("SUPABASE_DB_HOST:", process.env.SUPABASE_DB_HOST);
console.log("SUPABASE_DB_USER:", process.env.SUPABASE_DB_USER);
console.log("SUPABASE_DB_PASSWORD:", process.env.SUPABASE_DB_PASSWORD ? "✅" : "❌");

export const sequelize = new Sequelize(
  process.env.SUPABASE_DB_NAME,
  process.env.SUPABASE_DB_USER,
  process.env.SUPABASE_DB_PASSWORD,
  {
    host: process.env.SUPABASE_DB_HOST,
    port: process.env.SUPABASE_DB_PORT || 6543,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true, 
      freezeTableName: true
    }
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Conectado ao Supabase PostgreSQL!'))
  .catch(err => console.error('❌ Erro ao conectar:', err.message));