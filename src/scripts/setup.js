import { sequelize } from '../config/database.js';
import executarSeed from '../seeders/adminSeed.js';
import { criarDadosCompletos } from '../seeders/testData.js';

const setup = async () => {
  try {
    console.log('Configurando sistema pela primeira vez...');

    await sequelize.authenticate();
    console.log('Conectado ao banco!');

    await sequelize.sync({ force: false });
    console.log('Tabelas criadas!');
    
    await executarSeed();
    
    console.log('\nDeseja criar dados de teste adicionais? (y/n)');
    
    const criarTeste = true;
    
    if (criarTeste) {
      await criarDadosCompletos();
      console.log('Dados de teste criados!');
    }
    
    console.log('\nSISTEMA CONFIGURADO COM SUCESSO!');
    console.log('\nPRÓXIMOS PASSOS:');
    console.log('1. Execute: npm run dev');
    console.log('2. Acesse: http://localhost:3000');
    console.log('3. Teste login admin: admin@ongadocao.com / admin123456');
    console.log('4. Teste login tutor: carlos@email.com / tutor123456');
    
  } catch (error) {
    console.error('Erro no setup:', error);
  } finally {
    process.exit(0);
  }
};

setup();