import express from 'express';
import tutorController from '../controllers/tutorController.js';
import { verificarAutenticacao } from '../middleware/auth.js';

const router = express.Router();

router.post('/', tutorController.cadastrarTutor);

router.get('/:id', verificarAutenticacao, tutorController.buscarTutor);

router.patch('/:id', verificarAutenticacao, tutorController.atualizarTutor);

export default router;