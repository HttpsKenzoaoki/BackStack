import { Adocao, Tutor, Animal, Questionario } from '../models/index.js';
import { sequelize } from '../config/database.js';

class AdocaoController {
  async criarPedidoAdocao(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { tutor_id, animal_id } = req.body;

      if (!tutor_id || !animal_id) {
        await transaction.rollback();
        return res.status(400).json({
          erro: "tutor_id e animal_id são obrigatórios"
        });
      }

      const tutor = await Tutor.findByPk(tutor_id);
      if (!tutor) {
        await transaction.rollback();
        return res.status(404).json({
          erro: "Tutor ou animal não encontrado"
        });
      }

      const animal = await Animal.findByPk(animal_id);
      if (!animal) {
        await transaction.rollback();
        return res.status(404).json({
          erro: "Tutor ou animal não encontrado"
        });
      }

      if (animal.adotado) {
        await transaction.rollback();
        return res.status(400).json({
          erro: "Animal já foi adotado"
        });
      }

      const questionario = await Questionario.findOne({
        where: { tutor_id }
      });

      if (!questionario) {
        await transaction.rollback();
        return res.status(400).json({
          erro: "O tutor ainda não respondeu o questionário obrigatório"
        });
      }

      const pedidoExistente = await Adocao.findOne({
        where: {
          tutor_id,
          animal_id,
          status: 'em_analise'
        }
      });

      if (pedidoExistente) {
        await transaction.rollback();
        return res.status(409).json({
          erro: "Este tutor já tem um pedido de adoção para este animal"
        });
      }

      const pedidosNaFila = await Adocao.count({
        where: {
          animal_id,
          status: 'em_analise'
        }
      });

      const posicaoFila = pedidosNaFila + 1;

      const adocao = await Adocao.create({
        tutor_id,
        animal_id,
        status: 'em_analise',
        posicao_fila: posicaoFila
      }, { transaction });

      await transaction.commit();

      res.status(201).json({
        id: adocao.id,
        tutor_id: adocao.tutor_id,
        animal_id: adocao.animal_id,
        status: adocao.status,
        posicao_fila: adocao.posicao_fila,
        criado_em: adocao.createdAt
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao criar pedido de adoção:', error);
      res.status(500).json({
        erro: "Erro ao registrar o pedido de adoção"
      });
    }
  }

  async reorganizarFila(animal_id, transaction) {
    const pedidos = await Adocao.findAll({
      where: {
        animal_id,
        status: 'em_analise'
      },
      order: [['createdAt', 'ASC']]
    });

    for (let i = 0; i < pedidos.length; i++) {
      await pedidos[i].update({
        posicao_fila: i + 1
      }, { transaction });
    }
  }

  async cancelarPedido(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;

      const adocao = await Adocao.findByPk(id);
      if (!adocao) {
        await transaction.rollback();
        return res.status(404).json({
          erro: "Pedido de adoção não encontrado"
        });
      }

      const animal_id = adocao.animal_id;

      await adocao.destroy({ transaction });

      await this.reorganizarFila(animal_id, transaction);

      await transaction.commit();

      res.status(204).send();

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao cancelar pedido:', error);
      res.status(500).json({
        erro: "Erro ao cancelar pedido de adoção"
      });
    }
  }
}

export default new AdocaoController();