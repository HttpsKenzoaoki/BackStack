import express from 'express';
import animalController from '../controllers/animalController.js';
import { verificarAutenticacao, verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', animalController.listarAnimais);

router.post('/', verificarAutenticacao, verificarAdmin, animalController.cadastrarAnimal);

router.get('/:id', verificarAutenticacao, verificarAdmin, animalController.buscarAnimal);

export default router;