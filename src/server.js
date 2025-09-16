import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { 
  tratarErros, 
  rotaNaoEncontrada, 
  logarRequisicoes, 
  rateLimitAPI, 
  configurarSeguranca, 
  sanitizarInput 
} from './middleware/index.js';

import animalRoutes from './routes/animals.js';
import tutorRoutes from './routes/tutors.js';
import questionarioRoutes from './routes/questionnaire.js';
import adocaoRoutes from './routes/adoptions.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import doacaoRoutes from './routes/donations.js';

import './models/index.js';
import { sequelize } from './config/database.js';

const app = express();
const PORT = 3000;

app.use(configurarSeguranca);
app.use(rateLimitAPI);
app.use(logarRequisicoes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(sanitizarInput);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/animais', animalRoutes);
app.use('/tutores', tutorRoutes);
app.use('/questionario', questionarioRoutes);
app.use('/adocoes', adocaoRoutes);
app.use('/admin', adminRoutes);
app.use('/autenticacao', authRoutes);
app.use('/doacoes', doacaoRoutes);


app.get('/', (req, res) => {
  res.json({ 
    message: 'BackStack API - Sistema de Adoção de Animais',
    version: '1.0.0',
    authors: [
      'Wiliam Kenzo Aoki Da Silva',
      'Julia Da Silva Rodrigues Ferreira', 
      'Eduardo Henrique de Oliveira Santos',
      'Guilherme Lacerda Oliveira'
    ],
    repository: 'https://github.com/HttpsKenzoaoki/BackStack',
    endpoints: {
      animals: [
        'GET /animais - Listar animais disponíveis',
        'POST /animais - Cadastrar animal (admin)',
        'GET /animais/:id - Buscar animal por ID (admin)'
      ],
      tutors: [
        'POST /tutores - Cadastrar tutor',
        'GET /tutores/:id - Buscar tutor',
        'PATCH /tutores/:id - Atualizar tutor'
      ],
      questionnaire: [
        'POST /questionario - Cadastrar questionário'
      ],
      adoptions: [
        'POST /adocoes - Criar pedido de adoção',
        'DELETE /adocoes/:id - Cancelar pedido'
      ],
      admin: [
        'GET /admin/animais - Listar todos animais',
        'PATCH /admin/animais/:id - Atualizar animal',
        'DELETE /admin/animais/:id - Deletar animal'
      ],
      auth: [
        'POST /autenticacao - Login'
      ],
      donations: [
        'POST /doacoes - Registrar doação'
      ]
    }
  });
});


app.use(rotaNaoEncontrada);

app.use(tratarErros);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com SQLite estabelecida!');
    
    await sequelize.sync({ force: false });
    console.log('Tabelas sincronizadas!');
    
    app.listen(PORT, () => {
      console.log('\nBackStack API - Sistema de Adoção de Animais');
      console.log('='.repeat(50));
      console.log(`Servidor: http://localhost:${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Segurança: Ativada`);
      console.log(`Logs: Ativados`);
      console.log(`Rate Limiting: Ativo`);
      console.log('\nEquipe de Desenvolvimento:');
      console.log('  • Wiliam Kenzo Aoki Da Silva');
      console.log('  • Julia Da Silva Rodrigues Ferreira');
      console.log('  • Eduardo Henrique de Oliveira Santos');
      console.log('  • Guilherme Lacerda Oliveira');
      console.log('\nDocumentação: https://github.com/HttpsKenzoaoki/BackStack');
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Erro ao conectar com banco:', error);
    process.exit(1);
  }
}

startServer();