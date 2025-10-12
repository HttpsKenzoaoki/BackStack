import { Tutor } from '../models/index.js';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

async function resetPassword() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conectado ao banco\n');

        const admin = await Tutor.findOne({
            where: { email: 'admin@ongadocao.com' }
        });

        if (!admin) {
            console.log('❌ Admin não encontrado!');
            process.exit(1);
        }

        console.log('📝 Admin encontrado:', admin.email);
        
        // Hash manual da senha
        const novaSenhaHash = await bcrypt.hash('admin123456', 10);
        
        // Atualiza diretamente sem trigger do hook
        await sequelize.query(
            'UPDATE tutores SET senha = :senha WHERE email = :email',
            {
                replacements: { 
                    senha: novaSenhaHash, 
                    email: 'admin@ongadocao.com' 
                }
            }
        );

        console.log('✅ Senha resetada com sucesso!\n');

        // Verifica se funcionou
        const adminAtualizado = await Tutor.findOne({
            where: { email: 'admin@ongadocao.com' }
        });

        const senhaCorreta = await bcrypt.compare('admin123456', adminAtualizado.senha);
        console.log(`🔐 Verificação: ${senhaCorreta ? '✅ Senha está correta!' : '❌ Erro na senha'}`);

        const verificacaoModelo = await adminAtualizado.verificarSenha('admin123456');
        console.log(`🔐 Método verificarSenha: ${verificacaoModelo ? '✅ Funcionando!' : '❌ Erro'}`);

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

resetPassword();