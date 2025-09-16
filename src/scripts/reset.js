import { resetarBanco } from '../seeders/testData.js';

const reset = async () => {
  try {
    console.log('ATENÇÃO: Esta operação irá deletar todos os dados!');
    console.log('Tem certeza que deseja continuar? [y/N]');
    
    const confirmar = true; // Para automação, mas em produção seria interativo
    
    if (confirmar) {
      await resetarBanco();
      console.log('\nBanco resetado e populado com dados de exemplo!');
      console.log('\nCredenciais:');
      console.log('Admin: admin@ongadocao.com / admin123456');
      console.log('Tutor: carlos@email.com / tutor123456');
    } else {
      console.log('Operação cancelada.');
    }
    
  } catch (error) {
    console.error('Erro ao resetar banco:', error);
  } finally {
    process.exit(0);
  }
};

reset();
