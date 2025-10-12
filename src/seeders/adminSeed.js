import { Tutor, Animal, Questionario } from '../models/index.js';
import { sequelize } from '../config/database.js';

const criarAdministradores = async () => {
  try {
    console.log('Iniciando seed dos administradores...');

    const adminExistente = await Tutor.findOne({
      where: { is_admin: true }
    });

    if (adminExistente) {
      console.log('Administradores já existem no sistema!');
      return;
    }

    const administradores = [
      {
        nome_completo: 'Administrator Sistema',
        senha: 'admin123456', 
        email: 'admin@ongadocao.com',
        cidade: 'São Paulo',
        estado: 'SP',
        idade: 30,
        telefone: '11999999999',
        instagram: '@ong_adocao',
        facebook: 'ONG Adoção Animais',
        is_admin: true
      },
      {
        nome_completo: 'Maria Silva Santos',
        senha: 'admin123456',
        email: 'maria.admin@ongadocao.com',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        idade: 35,
        telefone: '21988888888',
        instagram: '@maria_ong',
        facebook: 'Maria Santos ONG',
        is_admin: true
      },
      {
        nome_completo: 'João Carlos Oliveira',
        senha: 'admin123456',
        email: 'joao.admin@ongadocao.com',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        idade: 42,
        telefone: '31977777777',
        instagram: '@joao_ong',
        facebook: 'João ONG Animais',
        is_admin: true
      }
    ];

    const adminsCreated = await Tutor.bulkCreate(administradores);
    
    console.log(`${adminsCreated.length} administradores criados com sucesso!`);
    
    console.log('\nCREDENCIAIS DOS ADMINISTRADORES:');
    console.log('=====================================');
    administradores.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.nome_completo}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Senha: admin123456`);
      console.log(`   Cidade: ${admin.cidade}/${admin.estado}`);
      console.log('   ---');
    });

  } catch (error) {
    console.error('Erro ao criar administradores:', error);
    throw error;
  }
};

const criarDadosExemplo = async () => {
  try {
    console.log('\nCriando animais de exemplo...');

    const animalExistente = await Animal.findOne();
    if (animalExistente) {
      console.log('Animais já existem no sistema!');
      return;
    }

    const animaisExemplo = [
      {
        nome: 'Rex',
        especie: 'Cão',
        porte: 'grande',
        castrado: true,
        vacinado: true,
        adotado: false,
        descricao: 'Rex é um labrador muito carinhoso e brincalhão. Adora crianças e é muito obediente. Precisa de uma família que tenha espaço para ele correr e brincar.'
      },
      {
        nome: 'Luna',
        especie: 'Gato',
        porte: 'pequeno',
        castrado: true,
        vacinado: true,
        adotado: false,
        descricao: 'Luna é uma gatinha muito dócil e carinhosa. Gosta de colo e é muito independente. Ideal para apartamentos.'
      },
      {
        nome: 'Bolt',
        especie: 'Cão',
        porte: 'médio',
        castrado: false,
        vacinado: true,
        adotado: false,
        descricao: 'Bolt é um vira-lata muito esperto e protetor. Ótimo para quem busca um companheiro fiel e guardião.'
      },
      {
        nome: 'Mimi',
        especie: 'Gato',
        porte: 'pequeno',
        castrado: true,
        vacinado: false,
        adotado: false,
        descricao: 'Mimi é uma gatinha resgatada recentemente. Ainda está se adaptando, mas é muito carinhosa com quem ganha sua confiança.'
      },
      {
        nome: 'Thor',
        especie: 'Cão',
        porte: 'grande',
        castrado: true,
        vacinado: true,
        adotado: false,
        descricao: 'Thor é um pastor alemão muito inteligente e leal. Precisa de exercícios diários e é ideal para famílias ativas.'
      },
      {
        nome: 'Princesa',
        especie: 'Cão',
        porte: 'pequeno',
        castrado: true,
        vacinado: true,
        adotado: false,
        descricao: 'Princesa é uma pequinês muito carinhosa e calma. Perfeita para idosos ou pessoas que buscam um animal mais tranquilo.'
      }
    ];

    const animaisCriados = await Animal.bulkCreate(animaisExemplo);
    console.log(`${animaisCriados.length} animais criados com sucesso!`);

  } catch (error) {
    console.error('Erro ao criar animais de exemplo:', error);
    throw error;
  }
};

const criarTutorExemplo = async () => {
  try {
    console.log('\nCriando tutor de exemplo...');

    const tutorExistente = await Tutor.findOne({
      where: { is_admin: false }
    });

    if (tutorExistente) {
      console.log('Tutores já existem no sistema!');
      return;
    }

    const tutorExemplo = {
      nome_completo: 'Carlos Eduardo Silva',
      senha: 'tutor123456',
      email: 'carlos@email.com',
      cidade: 'São Paulo',
      estado: 'SP',
      idade: 28,
      telefone: '11987654321',
      instagram: '@carlos_edu',
      facebook: 'Carlos Eduardo',
      is_admin: false
    };

    const tutorCriado = await Tutor.create(tutorExemplo);

    const questionarioExemplo = {
      tutor_id: tutorCriado.id,
      empregado: true,
      quantos_animais_possui: 0,
      motivos_para_adotar: 'Sempre amei animais e agora tenho condições de cuidar bem de um pet',
      quem_vai_sustentar_o_animal: 'Eu mesmo',
      numero_adultos_na_casa: 2,
      numero_criancas_na_casa: 0,
      idades_criancas: [],
      residencia_tipo: 'própria',
      proprietario_permite_animais: true,
      todos_de_acordo_com_adocao: true,
      responsavel_pelo_animal: 'Carlos Eduardo Silva',
      responsavel_concorda_com_adocao: true,
      ha_alergico_ou_pessoas_que_nao_gostam: false,
      gasto_mensal_estimado: 300.00,
      valor_disponivel_no_orcamento: true,
      tipo_alimentacao: 'Ração premium',
      local_que_o_animal_vai_ficar: 'dentro de casa',
      forma_de_permanencia: 'solto 24h',
      forma_de_confinamento: 'nenhum',
      tera_brinquedos: true,
      tera_abrigo: true,
      tera_passeios_acompanhado: true,
      tera_passeios_sozinho: false,
      companhia_outro_animal: false,
      companhia_humana_24h: false,
      companhia_humana_parcial: true,
      sem_companhia_humana: false,
      sem_companhia_animal: true,
      o_que_faz_em_viagem: 'Deixo com parentes ou hotel pet',
      o_que_faz_se_fugir: 'Procuro imediatamente e coloco cartazes',
      o_que_faz_se_nao_puder_criar: 'Procuro uma nova família responsável',
      animais_que_ja_criou: 'Tive um cão na infância',
      destino_animais_anteriores: 'Faleceu de velhice',
      costuma_esterilizar: true,
      costuma_vacinar: true,
      costuma_vermifugar: true,
      veterinario_usual: 'Clínica Veterinária Amigo Fiel',
      forma_de_educar: 'Com paciência e reforço positivo',
      envia_fotos_e_videos_do_local: true,
      aceita_visitas_e_fotos_do_animal: true,
      topa_entrar_grupo_adotantes: true,
      concorda_com_taxa_adocao: true,
      data_disponivel_para_buscar_animal: '2024-01-15'
    };

    await Questionario.create(questionarioExemplo);

    console.log('Tutor de exemplo criado com sucesso!');
    console.log('\nCREDENCIAIS DO TUTOR DE EXEMPLO:');
    console.log('===================================');
    console.log(`Nome: ${tutorExemplo.nome_completo}`);
    console.log(`Email: ${tutorExemplo.email}`);
    console.log(`Senha: tutor123456`);
    console.log(`Questionário: Preenchido`);

  } catch (error) {
    console.error('Erro ao criar tutor de exemplo:', error);
    throw error;
  }
};

const executarSeed = async () => {
  try {
    // Importar configuração do banco
    await sequelize.authenticate();
    console.log('Conectado ao banco de dados!');

    // Sincronizar tabelas
    await sequelize.sync({ force: false });
    console.log('Tabelas sincronizadas!');

    // Executar seeds
    await criarAdministradores();
    await criarDadosExemplo();
    await criarTutorExemplo();

    console.log('\nSEED CONCLUÍDO COM SUCESSO!');
    console.log('\nRESUMO:');
    console.log('===========');
    
    const totalAdmins = await Tutor.count({ where: { is_admin: true } });
    const totalTutores = await Tutor.count({ where: { is_admin: false } });
    const totalAnimais = await Animal.count();
    const totalQuestionarios = await Questionario.count();

    console.log(`Administradores: ${totalAdmins}`);
    console.log(`Tutores: ${totalTutores}`);
    console.log(`Animais: ${totalAnimais}`);
    console.log(`Questionários: ${totalQuestionarios}`);

    console.log('\nAgora você pode iniciar o servidor com: npm run dev');
    console.log('E testar a API em: http://localhost:3000');

  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    process.exit(0);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  criarAdministradores()
    .then(() => {
      console.log('✅ Seed concluído');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erro no seed:', error);
      process.exit(1);
    });
}

export default executarSeed;