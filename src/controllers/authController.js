import { Tutor } from '../models/index.js';
import jwt from 'jsonwebtoken';

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          erro: "Email e senha são obrigatórios"
        });
      }

      const tutor = await Tutor.findOne({
        where: { email: email.toLowerCase() }
      });

      if (!tutor) {
        return res.status(401).json({
          erro: "Email ou senha inválidos."
        });
      }

      const senhaValida = await tutor.verificarSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({
          erro: "Email ou senha inválidos."
        });
      }

      const token = jwt.sign(
        { 
          id: tutor.id, 
          email: tutor.email,
          is_admin: tutor.is_admin 
        },
        process.env.JWT_SECRET || 'secret_muito_seguro',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: "Login realizado com sucesso",
        token,
        user: {
          id: tutor.id,
          nome: tutor.nome_completo,
          email: tutor.email,
          is_admin: tutor.is_admin
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        erro: "Erro interno ao tentar fazer o login."
      });
    }
  }
}

export default new AuthController();