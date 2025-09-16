import { Tutor, Questionario } from '../models/index.js';

class TutorController {
  async cadastrarTutor(req, res) {
    try {
      const { 
        nome_completo, 
        senha, 
        email, 
        cidade, 
        estado, 
        idade, 
        telefone, 
        instagram, 
        facebook 
      } = req.body;

      if (!nome_completo || !senha || !email || !cidade || !estado || !idade || !telefone) {
        return res.status(400).json({
          erro: "Todos os campos obrigatórios devem ser preenchidos corretamente."
        });
      }

      const tutorExistente = await Tutor.findOne({ where: { email } });
      if (tutorExistente) {
        return res.status(400).json({
          erro: "Email preenchido já está sendo utilizado."
        });
      }

      if (idade < 18) {
        return res.status(400).json({
          erro: "Tutor deve ser maior de idade."
        });
      }

      const tutor = await Tutor.create({
        nome_completo,
        senha,
        email: email.toLowerCase(),
        cidade,
        estado: estado.toUpperCase(),
        idade: parseInt(idade),
        telefone,
        instagram: instagram || null,
        facebook: facebook || null
      });

      res.status(201).json({
        id: tutor.id,
        nome_completo: tutor.nome_completo,
        senha: "***", 
        email: tutor.email,
        cidade: tutor.cidade,
        estado: tutor.estado,
        idade: tutor.idade,
        telefone: tutor.telefone,
        instagram: tutor.instagram,
        facebook: tutor.facebook
      });

    } catch (error) {
      console.error('Erro ao cadastrar tutor:', error);
      res.status(500).json({
        erro: "Erro interno ao cadastrar o tutor."
      });
    }
  }

  async buscarTutor(req, res) {
    try {
      const { id } = req.params;

      const tutor = await Tutor.findByPk(id, {
        include: [{
          model: Questionario,
          as: 'questionario',
          required: false
        }],
        attributes: { exclude: ['senha'] } 
      });

      if (!tutor) {
        return res.status(404).json({
          erro: "Tutor não encontrado"
        });
      }

      res.status(200).json({
        id: tutor.id,
        nome_completo: tutor.nome_completo,
        email: tutor.email,
        cidade: tutor.cidade,
        estado: tutor.estado,
        idade: tutor.idade,
        telefone: tutor.telefone,
        instagram: tutor.instagram,
        facebook: tutor.facebook,
        questionario: tutor.questionario || null
      });

    } catch (error) {
      console.error('Erro ao buscar tutor:', error);
      res.status(500).json({
        erro: "Erro ao buscar dados do tutor"
      });
    }
  }

  async atualizarTutor(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;

      if (Object.keys(dadosAtualizacao).length === 0) {
        return res.status(400).json({
          erro: "Pelo menos um campo deve ser enviado para atualização"
        });
      }

      const tutor = await Tutor.findByPk(id);
      if (!tutor) {
        return res.status(404).json({
          erro: "Tutor não encontrado"
        });
      }

      const camposPermitidos = [
        'nome_completo', 'email', 'cidade', 'estado', 
        'idade', 'telefone', 'instagram', 'facebook'
      ];
      
      const dadosFiltrados = {};
      camposPermitidos.forEach(campo => {
        if (dadosAtualizacao[campo] !== undefined) {
          dadosFiltrados[campo] = dadosAtualizacao[campo];
        }
      });

      await tutor.update(dadosFiltrados);

      const tutorAtualizado = await Tutor.findByPk(id, {
        include: [{
          model: Questionario,
          as: 'questionario',
          required: false
        }],
        attributes: { exclude: ['senha'] }
      });

      res.status(200).json({
        id: tutorAtualizado.id,
        nome_completo: tutorAtualizado.nome_completo,
        email: tutorAtualizado.email,
        cidade: tutorAtualizado.cidade,
        estado: tutorAtualizado.estado,
        questionario: tutorAtualizado.questionario
      });

    } catch (error) {
      console.error('Erro ao atualizar tutor:', error);
      res.status(500).json({
        erro: "Erro ao atualizar os dados do tutor"
      });
    }
  }
}

export default new TutorController();