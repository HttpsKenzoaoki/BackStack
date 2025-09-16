import jwt from 'jsonwebtoken';
import { Tutor } from '../models/index.js';

export const verificarAutenticacao = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        erro: "Token de acesso requerido"
      });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        erro: "Token de acesso requerido"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_muito_seguro');

    const tutor = await Tutor.findByPk(decoded.id, {
      attributes: ['id', 'email', 'is_admin', 'nome_completo']
    });

    if (!tutor) {
      return res.status(401).json({
        erro: "Token inválido - usuário não encontrado"
      });
    }

    req.user = {
      id: tutor.id,
      email: tutor.email,
      nome: tutor.nome_completo,
      is_admin: tutor.is_admin
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        erro: "Token expirado"
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        erro: "Token inválido"
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      erro: "Erro interno de autenticação"
    });
  }
};

export const verificarAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      erro: "Usuário não autenticado"
    });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({
      erro: "Acesso não autorizado. Apenas administradores podem acessar este recurso."
    });
  }

  next();
};

export const verificarProprioUsuarioOuAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      erro: "Usuário não autenticado"
    });
  }

  const tutorId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.is_admin;

  if (tutorId !== userId && !isAdmin) {
    return res.status(403).json({
      erro: "Acesso negado. Você só pode acessar seus próprios dados."
    });
  }

  next();
};

export const autenticacaoOpcional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_muito_seguro');
    const tutor = await Tutor.findByPk(decoded.id, {
      attributes: ['id', 'email', 'is_admin', 'nome_completo']
    });

    if (tutor) {
      req.user = {
        id: tutor.id,
        email: tutor.email,
        nome: tutor.nome_completo,
        is_admin: tutor.is_admin
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};