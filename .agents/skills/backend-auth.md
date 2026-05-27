# Skill: Autenticação (Roles, Next-Auth e Crypto)

A autenticação primária não ocorre via Supabase Auth. Ela é tratada diretamente pela API usando senhas validadas com o módulo `crypto` do Node e tokens JWT customizados. O front-end (usando `next-auth`) consome esses endpoints para gerenciar a sessão.

## 1. Mapeamento de Roles (Cargos)
O sistema opera com duas roles exclusivas:
- **`admin`**: Nível máximo de acesso (Arcadian Hub admins).
- **`client`**: Acesso de visualização ou interações específicas do portal do cliente.

## 2. Criptografia (`crypto`)
A biblioteca `bcryptjs` foi descontinuada do escopo de regras. Agora, o hash e verificação de senhas devem ser feitos **obrigatoriamente** utilizando a API nativa de `crypto` do Node.js (ex: `scrypt`, `pbkdf2` ou `createHash` dependendo da implementação definida nas functions de utilidade de segurança).

## 3. Emissão e Validação de JWT
- A geração do token ocorre no momento do login (geralmente sob o domínio `/usecase/auth/login/`).
- Utilize a biblioteca `jsonwebtoken`.
- O payload do token deve carregar as informações primordiais (id do usuário, role).
- Valide as requisições em rotas protegidas através de **Middlewares de Autenticação** (ex: `middlewares/authMiddleware.ts`).
