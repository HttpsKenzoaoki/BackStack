import express from 'express';
import adminController from '../controllers/adminController.js';
import { verificarAutenticacao, verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/animais', verificarAutenticacao, verificarAdmin, adminController.listarTodosAnimais);

router.patch('/animais/:id', verificarAutenticacao, verificarAdmin, adminController.atualizarAnimal);

router.delete('/animais/:id', verificarAutenticacao, verificarAdmin, adminController.deletarAnimal);

export default router;