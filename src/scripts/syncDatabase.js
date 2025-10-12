import { sequelize } from '../config/database.js';
import '../models/index.js'; 

async function sync() {
    try {
        console.log('🔄 Sincronizando banco de dados...');
        console.log('⚠️  ATENÇÃO: Isso vai DELETAR todas as tabelas e recriar!');
        
        await sequelize.sync({ force: true });
        
        console.log('✅ Banco sincronizado com sucesso!');
        console.log('📝 Agora crie o admin novamente: node src/scripts/createAdmin.js');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao sincronizar:', error);
        process.exit(1);
    }
}

sync();