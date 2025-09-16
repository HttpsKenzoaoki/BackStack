export { verificarAutenticacao, verificarAdmin, verificarProprioUsuarioOuAdmin, autenticacaoOpcional } from './auth.js';
export { 
  verificarValidacao, 
  validarCadastroAnimal, 
  validarCadastroTutor, 
  validarLogin, 
  validarPedidoAdocao, 
  validarDoacao, 
  validarIdParam, 
  validarQueryPaginacao 
} from './validation.js';
export { tratarErros, rotaNaoEncontrada } from './errorHandler.js';
export { logarRequisicoes, logarErro } from './logger.js';
export { rateLimitGeral, rateLimitLogin, rateLimitAPI } from './rateLimit.js';
export { configurarSeguranca, sanitizarInput } from './security.js';