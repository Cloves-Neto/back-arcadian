# ⚙️ Arcadian Hub - Backend

Este é o módulo de servidor (API) do **Arcadian Hub**, responsável pela lógica de negócio, persistência de dados e segurança do ecossistema Arcadia Creative Studio.

---

## 🚀 Sobre o Projeto
Este backend foi construído para o **Portfólio de Cloves Neto**, demonstrando expertise em:
- Arquitetura Modular e Clean Code.
- Segurança com JWT e criptografia.
- Integração com Bancos de Dados e Serviços Cloud (Supabase/PostgreSQL).

---

## 🛠️ Stack Tecnológica

![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## ✨ Funcionalidades Principais

- **🔐 Autenticação & Autorização:** Sistema de Login via JWT (JSON Web Tokens) e controle de acesso baseado em roles (Admin/User).
- **📝 Repositories & Use Cases:** Implementação do padrão Repository para desacoplamento de banco de dados.
- **📂 Gestão de Uploads:** Processamento de imagens via Multer e armazenamento no Supabase Storage.
- **📧 Serviço de E-mail:** Integração com Resend para envio de notificações e recuperação de senha.
- **🛡️ Segurança:** Criptografia de senhas com Bcryptjs e proteção contra CORS.
- **📊 Logging de Atividade:** Registro detalhado de ações realizadas no sistema para auditoria.
- **🔗 Database ORM:** Uso de Sequelize com TypeScript para garantir integridade e agilidade no desenvolvimento.

---

## 📦 Bibliotecas Utilizadas

- **Express 5:** Framework web rápido e minimalista.
- **Sequelize-Typescript:** ORM com suporte completo a decorators e tipagem forte.
- **JsonWebToken:** Geração e validação de tokens de acesso.
- **Bcryptjs:** Hashing seguro de senhas.
- **Resend:** API moderna para envio de e-mails transacionais.
- **Multer:** Middleware para manipulação de `multipart/form-data`.
- **UUID:** Geração de identificadores únicos universais.

---

## ⚙️ Como executar

1. Clone o repositório.
2. Acesse a pasta backend: `cd backend`.
3. Instale as dependências: `npm install`.
4. Configure as variáveis de ambiente no arquivo `.env` (DB_URL, JWT_SECRET, etc).
5. Execute em modo desenvolvimento: `npm run dev`.
6. Gere o build para produção: `npm run build`.

---

## 👨‍💻 Autor

Desenvolvido por **Cloves Neto**.
- [LinkedIn](https://www.linkedin.com/in/cloves-neto/)
- [GitHub](https://github.com/Cloves-Neto)

---

> "Construindo bases sólidas e seguras para aplicações escaláveis."
