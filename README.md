# BackStack API

Uma API REST completa para sistema de adoção de animais desenvolvida em Node.js com Express, Sequelize e SQLite.

## Funcionalidades

- **Autenticação JWT** com diferentes níveis de acesso
- **Cadastro de tutores** com validação completa
- **Questionário de adoção** detalhado e obrigatório
- **Gerenciamento de animais** (CRUD completo)
- **Sistema de pedidos de adoção** com fila automática
- **Área administrativa** para gerenciar animais
- **Sistema de doações** com geração de PIX
- **Rate limiting** e medidas de segurança
- **Logs estruturados** de todas as operações
- **Validação robusta** de dados de entrada

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **express-validator** - Validação de dados

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/HttpsKenzoaoki/BackStack.git
cd BackStack
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o sistema pela primeira vez:
```bash
npm run setup
```

4. Inicie o servidor:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run setup` - Configuração inicial do sistema
- `npm run seed` - Executa apenas os seeds básicos
- `npm run reset` - Reseta o banco e cria dados de teste

## Endpoints da API

### Autenticação
- `POST /autenticacao` - Login de usuário

### Tutores
- `POST /tutores` - Cadastrar novo tutor
- `GET /tutores/:id` - Buscar tutor por ID
- `PATCH /tutores/:id` - Atualizar dados do tutor

### Animais
- `GET /animais` - Listar animais disponíveis para adoção
- `POST /animais` - Cadastrar animal (somente admin)
- `GET /animais/:id` - Buscar animal por ID (somente admin)

### Questionário
- `POST /questionario` - Cadastrar questionário de adoção

### Adoções
- `POST /adocoes` - Criar pedido de adoção
- `DELETE /adocoes/:id` - Cancelar pedido de adoção

### Administração
- `GET /admin/animais` - Listar todos os animais
- `PATCH /admin/animais/:id` - Atualizar animal
- `DELETE /admin/animais/:id` - Deletar animal

### Doações
- `POST /doacoes` - Registrar nova doação

## Credenciais de Teste

Após executar o setup, você terá as seguintes credenciais:

**Administrador:**
- Email: `admin@ongadocao.com`
- Senha: `admin123456`

**Tutor de Exemplo:**
- Email: `carlos@email.com`
- Senha: `tutor123456`

## Estrutura do Projeto

```
src/
├── config/          # Configurações (banco de dados)
├── controllers/     # Controladores da aplicação
├── middleware/      # Middlewares (auth, validação, etc.)
├── models/          # Modelos do Sequelize
├── routes/          # Definição das rotas
├── scripts/         # Scripts utilitários
├── seeders/         # Seeds para popular o banco
└── server.js        # Arquivo principal
```

## Segurança

- Autenticação JWT obrigatória para rotas protegidas
- Hash de senhas com bcrypt
- Rate limiting para prevenir ataques
- Sanitização de inputs
- Headers de segurança configurados
- Validação rigorosa de dados

## Equipe de Desenvolvimento

- Wiliam Kenzo Aoki Da Silva
- Julia Da Silva Rodrigues Ferreira
- Eduardo Henrique de Oliveira Santos
- Guilherme Lacerda Oliveira

## Licença

ISC License

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Suporte

Para reportar bugs ou solicitar novas funcionalidades, abra uma issue em:
https://github.com/HttpsKenzoaoki/BackStack/issues