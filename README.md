# 🎭 ShowTime — Backend

API do sistema **ShowTime**, desenvolvida em **Node.js + Express**, responsável por gerenciar os dados de eventos, artistas e usuários.  
Este serviço fornece os endpoints consumidos pelo frontend e implementa as regras de negócio, autenticação e persistência dos dados.

---

## 🚀 Tecnologias Utilizadas
- [Node.js](https://nodejs.org/) — Ambiente de execução JavaScript  
- [Express](https://expressjs.com/) — Framework web para criação de APIs  
- [JavaScript]([https://www.javascript.com/]) — Tipagem estática (se aplicável)  
- [Sequelize](https://sequelize.org/) — ORM para banco de dados  
- [PostgreSQL](https://www.postgresql.org/) — Banco de dados principal  
- [JWT](https://jwt.io/) — Autenticação e controle de acesso  
- [dotenv](https://github.com/motdotla/dotenv) — Gerenciamento de variáveis de ambiente  
- [Nodemon](https://nodemon.io/) — Monitoramento automático em modo de desenvolvimento  

---

## ⚙️ Pré-requisitos
Antes de iniciar, verifique se você possui:
- **Node.js** v18+  
- **npm** ou **yarn**  
- **PostgreSQL** em execução  

Verifique as versões:
```bash
node -v
npm -v
psql --version
```

---

# 🧩 Instalação e Configuração
1. Clone o repositório
```bash
git clone https://github.com/lukera1910/showtime-backend.git
```

2. Acesse o repositório
```bash
cd showtime-backend
```

3. Instale as dependências
```bash
npm install
```
ou 
```
yarn install
```

4. Configure o ambiente
  - Crie um arquivo .env na raiz do projeto com as variáveis
    ```bash
    # Exemplo de .env
    PORT=1234
    DATABASE_URL=postgresql://usuario:senha@localhost:5432/showtime
    ```

---

# ▶️ Executando o projeto
Ambiente de desenvolvimento
```bash
npm run dev
```
Servidor iniciará em:
👉 http://localhost:8080

---

# 📁 Estrutura de Pastas
```bash
showtime-backend/
├── src/
│   ├── controllers/     # Lógica das rotas
│   ├── routes/          # Definições de endpoints
│   ├── models/          # Modelos (ORM)
│   ├── middlewares/     # Validações e autenticação
│   ├── services/        # Regras de negócio
│   ├── utils/           # Funções auxiliares
│   ├── config/          # Configuração (DB, JWT, etc)
│   └── server.ts        # Arquivo principal
├── prisma/ or migrations/  # Esquemas e migrações do banco
├── .env.example
├── package.json
└── tsconfig.json
```
