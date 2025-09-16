import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const formatarData = () => {
  return new Date().toISOString();
};

export const logarRequisicoes = (req, res, next) => {
  const inicio = Date.now();
  
  const dadosRequisicao = {
    timestamp: formatarData(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent') || 'N/A',
    user: req.user?.id || 'Não autenticado'
  };

  const originalJson = res.json;
  res.json = function(data) {
    const duracao = Date.now() - inicio;
    
    const dadosResposta = {
      ...dadosRequisicao,
      statusCode: res.statusCode,
      duracao: `${duracao}ms`,
      responseSize: JSON.stringify(data).length
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log(`${dadosResposta.method} ${dadosResposta.url} - ${dadosResposta.statusCode} - ${dadosResposta.duracao}`);
    }

    const logLine = JSON.stringify(dadosResposta) + '\n';
    const logFile = path.join(logsDir, `access-${new Date().toISOString().split('T')[0]}.log`);
    
    fs.appendFile(logFile, logLine, (err) => {
      if (err) console.error('Erro ao escrever log:', err);
    });

    return originalJson.call(this, data);
  };

  next();
};

export const logarErro = (error, req) => {
  const dadosErro = {
    timestamp: formatarData(),
    level: 'ERROR',
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    user: req.user?.id || 'Não autenticado',
    ip: req.ip || req.connection.remoteAddress
  };

  console.error('ERRO:', dadosErro);

  const logLine = JSON.stringify(dadosErro) + '\n';
  const logFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);
  
  fs.appendFile(logFile, logLine, (err) => {
    if (err) console.error('Erro ao escrever log de erro:', err);
  });
};