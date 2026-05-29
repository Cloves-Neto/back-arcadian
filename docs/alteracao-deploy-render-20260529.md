# Resumo da Alteração: Ajustes de Deploy para Render

**Data:** 29 de Maio de 2026
**Responsável:** JoyBoy (AI)

## 1. O Quê (O que foi feito?)
- Remoção do arquivo `src/app.ts`, consolidando a inicialização e middlewares inteiramente no `src/server.ts`.
- Atualização do path de execução do script `start` no `package.json` para refletir o build correto gerado pelo TypeScript (de `dist/server.js` para `dist/src/server.js`).
- Correção do path de leitura do `swagger.yaml` no `server.ts`, substituindo a resolução via `__dirname` por `process.cwd()`.
- Atualizações nos testes de integração para refletir a nova estrutura de inicialização.

## 2. Por Quê (Por que foi feito?)
O processo de deploy na plataforma Render estava falhando. Identificou-se que:
- O backend estava rodando as lógicas de middlewares no `app.ts` e exportando de forma dividida, o que não era ideal para deploy unificado.
- Devido à inclusão da pasta `tests` no `tsconfig.json`, o compilador preservava a estrutura raiz criando a subpasta `src/` dentro de `dist/`. Consequentemente, o comando de boot (`node dist/server.js`) quebrava na nuvem.
- O mapeamento do arquivo Swagger no `server.ts` utilizava `__dirname`. Após compilado, o path final procurava a documentação em `dist/docs/swagger.yaml` (que não existia), causando erro `ENOENT` e derrubando a aplicação no Boot.

## 3. Como (Como foi implementado?)
- No `package.json`:
  Alterado o `"start": "node dist/server.js"` para `"start": "node dist/src/server.js"`.
- No `server.ts`:
  Alterado o `YAML.load(path.join(__dirname, '../docs/swagger.yaml'))` para `YAML.load(path.join(process.cwd(), 'docs/swagger.yaml'))`.
- Nos testes (`tests/integration/*.spec.ts`):
  Removidas as importações obsoletas do `app.ts` e injetadas dependências corretas, adequando a lógica para testar o servidor exportado unificadamente pelo `server.ts`.
