import { Animal, Adocao, Tutor } from '../models/index.js';
import { Op } from 'sequelize';

class AdminController {
  async listarTodosAnimais(req, res) {
    try {
      const { especie, porte, castrado, vacinado, adotado, page = 1, limit = 10 } = req.query;

      const where = {};
      
      if (especie) where.especie = { [Op.iLike]: `%${especie}%` };
      if (porte) where.porte = porte;
      if (castrado !== undefined) where.castrado = castrado === 'true';
      if (vacinado !== undefined) where.vacinado = vacinado === 'true';
      if (adotado !== undefined) where.adotado = adotado === 'true';

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows } = await Animal.findAndCountAll({
        where,
        order: [['createdAt', 'ASC']],
        limit: parseInt(limit),
        offset,
        attributes: ['id', 'nome', 'especie', 'porte', 'castrado', 'vacinado', 'adotado', 'descricao', 'foto', 'createdAt']
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
      console.error('Erro ao buscar animais (admin):', error);
      res.status(500).json({
        erro: "Erro ao buscar animais"
      });
    }
  }

  async atualizarAnimal(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;

      if (Object.keys(dadosAtualizacao).length === 0) {
        return res.status(400).json({
          erro: "Nenhum campo foi fornecido para atualização"
        });
      }

      const animal = await Animal.findByPk(id);
      if (!animal) {
        return res.status(404).json({
          erro: "Animal não encontrado"
        });
      }

      const camposPermitidos = [
        'nome', 'especie', 'porte', 'castrado', 'vacinado', 
        'adotado', 'descricao', 'foto'
      ];
      
      const dadosFiltrados = {};
      camposPermitidos.forEach(campo => {
        if (dadosAtualizacao[campo] !== undefined) {
          if (campo === 'foto' && dadosAtualizacao[campo]) {
            try {
              const base64Data = dadosAtualizacao[campo].replace(/^data:image\/[a-z]+;base64,/, '');
              dadosFiltrados[campo] = Buffer.from(base64Data, 'base64');
            } catch (error) {
              return res.status(400).json({
                erro: "Formato de imagem inválido."
              });
            }
          } else {
            dadosFiltrados[campo] = dadosAtualizacao[campo];
          }
        }
      });

      await animal.update(dadosFiltrados);

      res.status(200).json({
        id: animal.id,
        nome: animal.nome,
        castrado: animal.castrado,
        vacinado: animal.vacinado,
        adotado: animal.adotado,
        descricao: animal.descricao,
        updated_at: animal.updatedAt
      });

    } catch (error) {
      console.error('Erro ao atualizar animal:', error);
      res.status(500).json({
        erro: "Erro ao atualizar o animal"
      });
    }
  }

  async deletarAnimal(req, res) {
    try {
      const { id } = req.params;

      const animal = await Animal.findByPk(id);
      if (!animal) {
        return res.status(404).json({
          erro: "Animal não encontrado"
        });
      }

      const pedidosAtivos = await Adocao.findOne({
        where: {
          animal_id: id,
          status: 'em_analise'
        }
      });

      if (pedidosAtivos) {
        return res.status(400).json({
          erro: "Não é possível deletar animal com pedidos de adoção ativos"
        });
      }

      await animal.destroy();

      res.status(204).send();

    } catch (error) {
      console.error('Erro ao deletar animal:', error);
      res.status(500).json({
        erro: "Erro ao remover animal"
      });
    }
  }
}

export default new AdminController();