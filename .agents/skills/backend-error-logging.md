# Skill: Tratamento de Erros e Logs

Este projeto adota uma padronização rígida para exceções e logs, garantindo rastreabilidade e mensagens de erro unificadas para a aplicação.

## 1. Tratamento de Erros (Error Classes e Global Middleware)
Não confie no `throw new Error()` genérico.
- **`AppError`**: Deve-se criar ou utilizar uma classe customizada `AppError` que extenda `Error`, recebendo não apenas a mensagem, mas também um `statusCode` HTTP (ex: 400, 401, 404).
- **Middleware Global de Erros**: Toda a aplicação deve ter um middleware de tratamento de exceções injetado no fim do `App.ts`.
  - Este middleware captura qualquer erro que escape dos `try/catch` dos `ServiceImpls` ou os redirecionamentos do Controller (via `next()`).
  - Se for instância de `AppError`, devolve o status correspondente.
  - Se for um erro desconhecido, loga criticamente e devolve status 500 para evitar expor dados da stack do erro ao front-end.

## 2. Configuração de Logs (Winston)
Para rastreamento profissional, utilizamos a biblioteca **Winston**.

**Diretrizes de implementação e uso:**
- O Winston deve ser configurado dentro de um arquivo próprio em `utils/logger.ts` ou `config/logger.ts`.
- **Transports Obrigatórios**:
  - `Console`: Com formato colorido para facilidade de desenvolvimento.
  - `File`: Log rotativo ou fixo para gravação persistente (ex: gravando `.log` em uma pasta `/logs`).
- **Níveis de Log**:
  - `logger.info(...)`: Para ações de sucesso como login, criação de registros.
  - `logger.error(...)`: Para exceções gravadas pelo Middleware Global ou catch nas Services.
  - `logger.warn(...)`: Para ações suspeitas ou limites excedidos.
