import { Animal, Adocao, Tutor } from '../models/index.js';
import { Op } from 'sequelize';

class AnimalController {
  async cadastrarAnimal(req, res) {
    try {
      const { nome, especie, porte, castrado, vacinado, descricao, foto } = req.body;

      if (!nome || !especie || !porte) {
        return res.status(400).json({
          erro: "Todos os campos obrigatórios devem ser preenchidos corretamente."
        });
      }

      if (!['pequeno', 'médio', 'grande'].includes(porte)) {
        return res.status(400).json({
          erro: "Porte deve ser: pequeno, médio ou grande."
        });
      }

      let fotoBuffer = null;
      if (foto) {
        try {
          const base64Data = foto.replace(/^data:image\/[a-z]+;base64,/, '');
          fotoBuffer = Buffer.from(base64Data, 'base64');
        } catch (error) {
          return res.status(400).json({
            erro: "Formato de imagem inválido."
          });
        }
      }

      const animal = await Animal.create({
        nome,
        especie,
        porte,
        castrado: castrado || false,
        vacinado: vacinado || false,
        descricao: descricao || '',
        foto: fotoBuffer
      });

      res.status(201).json({
        id: animal.id,
        nome: animal.nome,
        especie: animal.especie,
        porte: animal.porte,
        castrado: animal.castrado,
        vacinado: animal.vacinado,
        descricao: animal.descricao,
        foto: animal.foto
      });

    } catch (error) {
      console.error('Erro ao cadastrar animal:', error);
      res.status(500).json({
        erro: "Erro interno ao cadastrar o animal."
      });
    }
  }

  async listarAnimais(req, res) {
    try {
      const { especie, porte, castrado, vacinado, page = 1, limit = 10 } = req.query;

      const where = { adotado: false };
      
      if (especie) where.especie = { [Op.iLike]: `%${especie}%` };
      if (porte) where.porte = porte;
      if (castrado !== undefined) where.castrado = castrado === 'true';
      if (vacinado !== undefined) where.vacinado = vacinado === 'true';

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows } = await Animal.findAndCountAll({
        where,
        order: [['createdAt', 'ASC']], 
        limit: parseInt(limit),
        offset,
        attributes: ['id', 'nome', 'especie', 'porte', 'castrado', 'vacinado', 'descricao', 'foto', 'createdAt']
      });

      const animais = rows.map(animal => ({
        ...animal.toJSON(),
        foto: animal.foto ? animal.foto.toString('base64') : null
      }));

      res.status(200).json({
        data: animais,
        total: count
      });

    } catch (error) {
      console.error('Erro ao buscar animais:', error);
      res.status(500).json({
        erro: "Erro ao buscar animais"
      });
    }
  }

  async buscarAnimal(req, res) {
    try {
      const { id } = req.params;

      const animal = await Animal.findByPk(id, {
        include: [{
          model: Adocao,
          as: 'pedidos_adocao',
          where: { status: 'em_analise' },
          required: false,
          order: [['createdAt', 'ASC']],
          attributes: ['id', 'tutor_id', 'status', 'posicao_fila', 'createdAt']
        }]
      });

      if (!animal) {
        return res.status(404).json({
          erro: "Animal não encontrado"
        });
      }

      const pedidosIds = animal.pedidos_adocao.map(pedido => pedido.id);

      res.status(200).json({
        id: animal.id,
        nome: animal.nome,
        especie: animal.especie,
        porte: animal.porte,
        castrado: animal.castrado,
        vacinado: animal.vacinado,
        adotado: animal.adotado,
        descricao: animal.descricao,
        foto: animal.foto ? animal.foto.toString('base64') : null,
        pedidos: pedidosIds
      });

    } catch (error) {
      console.error('Erro ao buscar animal:', error);
      res.status(500).json({
        erro: "Animal não encontrado"
      });
    }
  }
}

export default new AnimalController();