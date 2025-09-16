export const tratarErros = (error, req, res, next) => {
  console.error('Erro capturado:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    user: req.user?.id || 'Não autenticado'
  });

  if (error.name === 'SequelizeValidationError') {
    const erros = error.errors.map(err => err.message);
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: erros
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      erro: 'Dados duplicados. Verifique se o email já não está em uso.'
    });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      erro: 'Referência inválida. Verifique se os dados relacionados existem.'
    });
  }

  if (error.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      erro: 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.'
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      erro: 'Token inválido'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      erro: 'Token expirado'
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      erro: 'JSON inválido'
    });
  }

  res.status(error.status || 500).json({
    erro: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : error.message
  });
};

export const rotaNaoEncontrada = (req, res) => {
  res.status(404).json({
    erro: `Rota ${req.method} ${req.originalUrl} não encontrada`,
    rotas_disponiveis: [
      'GET /animais',
      'POST /animais',
      'GET /animais/:id',
      'POST /tutores',
      'GET /tutores/:id',
      'PATCH /tutores/:id',
      'POST /questionario',
      'POST /adocoes',
      'DELETE /adocoes/:id',
      'GET /admin/animais',
      'PATCH /admin/animais/:id',
      'DELETE /admin/animais/:id',
      'POST /autenticacao',
      'POST /doacoes'
    ]
  });
};