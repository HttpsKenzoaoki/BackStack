import { Tutor } from '../models/index.js';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

async function createAdmin() {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Conectado ao banco\n');

        // Verifica se já existe
        const existente = await Tutor.findOne({
            where: { email: 'admin@ongadocao.com' }
        });

        if (existente) {
            console.log('⚠️  Admin já existe!');
            console.log('Deletando e recriando...\n');
            await existente.destroy();
        }

        // Hash da senha manualmente
        const senhaHash = await bcrypt.hash('admin123456', 10);

        // Cria o admin
        const admin = await Tutor.create({
            nome_completo: 'Administrator Sistema',
            senha: senhaHash, // Já enviamos hasheada para evitar problema com hooks
            email: 'admin@ongadocao.com',
            cidade: 'São Paulo',
            estado: 'SP',
            idade: 30,
            telefone: '11999999999',
            is_admin: true
        }, {
            hooks: false // Desabilita hooks para não hashear duas vezes
        });

        console.log('✅ Admin criado com sucesso!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Senha: admin123456');
        console.log('👑 Admin:', admin.is_admin);

        // Verifica se a senha está correta
        const verificacao = await bcrypt.compare('admin123456', admin.senha);
        console.log(`\n🔐 Verificação de senha: ${verificacao ? '✅ OK' : '❌ ERRO'}`);

        // Testa o método do modelo
        const verificacaoModelo = await admin.verificarSenha('admin123456');
        console.log(`🔐 Método verificarSenha: ${verificacaoModelo ? '✅ OK' : '❌ ERRO'}`);

        await sequelize.close();
        console.log('\n✅ Pronto! Agora tente fazer login no Postman.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

createAdmin();