import { body, param, query, validationResult } from 'express-validator';

export const verificarValidacao = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const primeiroErro = errors.array()[0];
    return res.status(400).json({
      erro: `${primeiroErro.msg}`,
      campo: primeiroErro.path
    });
  }
  
  next();
};

export const validarCadastroAnimal = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('especie')
    .notEmpty()
    .withMessage('Espécie é obrigatória')
    .isLength({ min: 2, max: 50 })
    .withMessage('Espécie deve ter entre 2 e 50 caracteres'),
  
  body('porte')
    .notEmpty()
    .withMessage('Porte é obrigatório')
    .isIn(['pequeno', 'médio', 'grande'])
    .withMessage('Porte deve ser: pequeno, médio ou grande'),
  
  body('castrado')
    .optional()
    .isBoolean()
    .withMessage('Castrado deve ser true ou false'),
  
  body('vacinado')
    .optional()
    .isBoolean()
    .withMessage('Vacinado deve ser true ou false'),
  
  body('descricao')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres'),
];

export const validarCadastroTutor = [
  body('nome_completo')
    .notEmpty()
    .withMessage('Nome completo é obrigatório')
    .isLength({ min: 3, max: 200 })
    .withMessage('Nome deve ter entre 3 e 200 caracteres'),
  
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  
  body('email')
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email deve ter formato válido')
    .normalizeEmail(),
  
  body('cidade')
    .notEmpty()
    .withMessage('Cidade é obrigatória')
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres'),
  
  body('estado')
    .notEmpty()
    .withMessage('Estado é obrigatório')
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter 2 caracteres (ex: SP, RJ)')
    .toUpperCase(),
  
  body('idade')
    .notEmpty()
    .withMessage('Idade é obrigatória')
    .isInt({ min: 18, max: 120 })
    .withMessage('Idade deve ser entre 18 e 120 anos'),
  
  body('telefone')
    .notEmpty()
    .withMessage('Telefone é obrigatório')
    .isMobilePhone('pt-BR')
    .withMessage('Telefone deve ter formato válido'),
  
  body('instagram')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Instagram deve ter no máximo 100 caracteres'),
  
  body('facebook')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Facebook deve ter no máximo 100 caracteres'),
];

export const validarLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email deve ter formato válido')
    .normalizeEmail(),
  
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
];

export const validarPedidoAdocao = [
  body('tutor_id')
    .notEmpty()
    .withMessage('ID do tutor é obrigatório')
    .isUUID()
    .withMessage('ID do tutor deve ser um UUID válido'),
  
  body('animal_id')
    .notEmpty()
    .withMessage('ID do animal é obrigatório')
    .isUUID()
    .withMessage('ID do animal deve ser um UUID válido'),
];

export const validarDoacao = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres'),
  
  body('email')
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email deve ter formato válido')
    .normalizeEmail(),
  
  body('valor')
    .notEmpty()
    .withMessage('Valor é obrigatório')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser maior que zero'),
  
  body('mensagem')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Mensagem deve ter no máximo 500 caracteres'),
];

export const validarIdParam = [
  param('id')
    .isUUID()
    .withMessage('ID deve ser um UUID válido'),
];

export const validarQueryPaginacao = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número maior que zero'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser entre 1 e 100'),
];