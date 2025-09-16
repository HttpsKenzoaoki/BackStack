import express from 'express';
import adocaoController from '../controllers/adocaoController.js';
import { verificarAutenticacao } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verificarAutenticacao, adocaoController.criarPedidoAdocao);

router.delete('/:id', verificarAutenticacao, adocaoController.cancelarPedido);

export default router;