import { Tutor, Animal, Questionario, Adocao } from '../models/index.js';
import { sequelize } from '../config/database.js';

const criarDadosCompletos = async () => {
  try {
    console.log('Criando dados de teste completos...');

    const maisAnimais = [
      {
        nome: 'Caramelo',
        especie: 'Cão',
        porte: 'médio',
        castrado: true,
        vacinado: true,
        adotado: false,
        descricao: 'Caramelo é o famoso vira-lata caramelo brasileiro! Super companheiro e adaptável.'
      },
      {
        nome: 'Snowball',
        especie: 'Coelho',
        porte: 'pequeno',
        castrado: true,
        vacinado: true,
        adotado: false,
        descricao: 'Snowball é um coelhinho branquinho muito dócil. Ideal para crianças.'
      },
      {
        nome: 'Pérola',
        especie: 'Gato',
        porte: 'pequeno',
        castrado: false,
        vacinado: false,
        adotado: false,
        descricao: 'Pérola foi resgatada há pouco tempo. Ainda precisa de cuidados veterinários.'
      },
      {
        nome: 'Hulk',
        especie: 'Cão',
        porte: 'grande',
        castrado: true,
        vacinado: true,
        adotado: true, 
        descricao: 'Hulk era um pitbull muito dócil que encontrou uma família amorosa.'
      }
    ];

    await Animal.bulkCreate(maisAnimais);

    const maisTutores = [
      {
        nome_completo: 'Ana Paula Costa',
        senha: 'senha123',
        email: 'ana@email.com',
        cidade: 'Curitiba',
        estado: 'PR',
        idade: 32,
        telefone: '41987654321',
        instagram: '@ana_costa',
        facebook: 'Ana Paula Costa',
        is_admin: false
      },
      {
        nome_completo: 'Roberto Santos',
        senha: 'senha123',
        email: 'roberto@email.com',
        cidade: 'Salvador',
        estado: 'BA',
        idade: 45,
        telefone: '71987654321',
        instagram: null,
        facebook: 'Roberto Santos',
        is_admin: false
      },
      {
        nome_completo: 'Fernanda Lima',
        senha: 'senha123',
        email: 'fernanda@email.com',
        cidade: 'Fortaleza',
        estado: 'CE',
        idade: 26,
        telefone: '85987654321',
        instagram: '@fe_lima',
        facebook: null,
        is_admin: false
      }
    ];

    const tutoresCriados = await Tutor.bulkCreate(maisTutores);

    console.log(`Criados ${maisAnimais.length} animais adicionais`);
    console.log(`Criados ${tutoresCriados.length} tutores adicionais`);

    const animaisDisponiveis = await Animal.findAll({
      where: { adotado: false },
      limit: 3
    });

    if (animaisDisponiveis.length > 0 && tutoresCriados.length > 0) {
      const carlos = await Tutor.findOne({ where: { email: 'carlos@email.com' } });
      
      if (carlos) {
        await Adocao.create({
          tutor_id: carlos.id,
          animal_id: animaisDisponiveis[0].id,
          status: 'em_analise',
          posicao_fila: 1
        });

        console.log('Pedido de adoção de exemplo criado');
      }
    }

    console.log('Dados de teste completos criados!');

  } catch (error) {
    console.error('Erro ao criar dados de teste:', error);
    throw error;
  }
};

const resetarBanco = async () => {
  try {
    console.log('RESETANDO BANCO DE DADOS...');
    
    await sequelize.sync({ force: true });
    console.log('Banco resetado!');
    
    const { default: executarSeed } = await import('./adminSeed.js');
    await executarSeed();
    
    await criarDadosCompletos();
    
  } catch (error) {
    console.error('Erro ao resetar banco:', error);
    throw error;
  }
};

export { criarDadosCompletos, resetarBanco };