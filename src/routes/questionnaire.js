import express from 'express';
import questionarioController from '../controllers/questionarioController.js';
import { verificarAutenticacao } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verificarAutenticacao, questionarioController.cadastrarQuestionario);

export default router;