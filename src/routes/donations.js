import express from 'express';
import doacaoController from '../controllers/doacaoController.js';

const router = express.Router();

router.post('/', doacaoController.criarDoacao);

export default router;