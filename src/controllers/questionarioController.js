import { Questionario, Tutor } from '../models/index.js';

class QuestionarioController {
  async cadastrarQuestionario(req, res) {
    try {
      const {
        tutor_id,
        empregado,
        quantos_animais_possui,
        motivos_para_adotar,
        quem_vai_sustentar_o_animal,
        numero_adultos_na_casa,
        numero_criancas_na_casa,
        idades_criancas,
        residencia_tipo,
        proprietario_permite_animais,
        todos_de_acordo_com_adocao,
        responsavel_pelo_animal,
        responsavel_concorda_com_adocao,
        ha_alergico_ou_pessoas_que_nao_gostam,
        gasto_mensal_estimado,
        valor_disponivel_no_orcamento,
        tipo_alimentacao,
        local_que_o_animal_vai_ficar,
        forma_de_permanencia,
        forma_de_confinamento,
        tera_brinquedos,
        tera_abrigo,
        tera_passeios_acompanhado,
        tera_passeios_sozinho,
        companhia_outro_animal,
        companhia_humana_24h,
        companhia_humana_parcial,
        sem_companhia_humana,
        sem_companhia_animal,
        o_que_faz_em_viagem,
        o_que_faz_se_fugir,
        o_que_faz_se_nao_puder_criar,
        animais_que_ja_criou,
        destino_animais_anteriores,
        costuma_esterilizar,
        costuma_vacinar,
        costuma_vermifugar,
        veterinario_usual,
        forma_de_educar,
        envia_fotos_e_videos_do_local,
        aceita_visitas_e_fotos_do_animal,
        topa_entrar_grupo_adotantes,
        concorda_com_taxa_adocao,
        data_disponivel_para_buscar_animal
      } = req.body;

      const tutor = await Tutor.findByPk(tutor_id);
      if (!tutor) {
        return res.status(400).json({
          erro: "Tutor não encontrado."
        });
      }

      const questionarioExistente = await Questionario.findOne({
        where: { tutor_id }
      });
      if (questionarioExistente) {
        return res.status(400).json({
          erro: "Tutor já possui questionário preenchido."
        });
      }

      const camposObrigatorios = [
        'empregado', 'quantos_animais_possui', 'motivos_para_adotar',
        'quem_vai_sustentar_o_animal', 'numero_adultos_na_casa',
        'numero_criancas_na_casa', 'residencia_tipo',
        'proprietario_permite_animais', 'todos_de_acordo_com_adocao',
        'responsavel_pelo_animal', 'responsavel_concorda_com_adocao',
        'ha_alergico_ou_pessoas_que_nao_gostam', 'gasto_mensal_estimado',
        'valor_disponivel_no_orcamento', 'tipo_alimentacao',
        'local_que_o_animal_vai_ficar', 'forma_de_permanencia',
        'data_disponivel_para_buscar_animal'
      ];

      for (const campo of camposObrigatorios) {
        if (req.body[campo] === undefined || req.body[campo] === null) {
          return res.status(400).json({
            erro: "Todos os campos obrigatórios devem ser preenchidos corretamente."
          });
        }
      }

      const questionario = await Questionario.create({
        tutor_id,
        empregado,
        quantos_animais_possui,
        motivos_para_adotar,
        quem_vai_sustentar_o_animal,
        numero_adultos_na_casa,
        numero_criancas_na_casa,
        idades_criancas: idades_criancas || [],
        residencia_tipo,
        proprietario_permite_animais,
        todos_de_acordo_com_adocao,
        responsavel_pelo_animal,
        responsavel_concorda_com_adocao,
        ha_alergico_ou_pessoas_que_nao_gostam,
        gasto_mensal_estimado,
        valor_disponivel_no_orcamento,
        tipo_alimentacao,
        local_que_o_animal_vai_ficar,
        forma_de_permanencia,
        forma_de_confinamento,
        tera_brinquedos,
        tera_abrigo,
        tera_passeios_acompanhado,
        tera_passeios_sozinho,
        companhia_outro_animal,
        companhia_humana_24h,
        companhia_humana_parcial,
        sem_companhia_humana,
        sem_companhia_animal,
        o_que_faz_em_viagem,
        o_que_faz_se_fugir,
        o_que_faz_se_nao_puder_criar,
        animais_que_ja_criou,
        destino_animais_anteriores,
        costuma_esterilizar,
        costuma_vacinar,
        costuma_vermifugar,
        veterinario_usual,
        forma_de_educar,
        envia_fotos_e_videos_do_local,
        aceita_visitas_e_fotos_do_animal,
        topa_entrar_grupo_adotantes,
        concorda_com_taxa_adocao,
        data_disponivel_para_buscar_animal
      });

      const { tutor_id: _, createdAt, updatedAt, ...questionarioData } = questionario.toJSON();

      res.status(201).json(questionarioData);

    } catch (error) {
      console.error('Erro ao cadastrar questionário:', error);
      res.status(500).json({
        erro: "Erro interno ao cadastrar questionário."
      });
    }
  }
}

export default new QuestionarioController();